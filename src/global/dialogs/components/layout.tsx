import {
  Button,
  Dialog,
  Portal,
  SegmentedButtons,
  Text,
} from 'react-native-paper';
import {useEffect, useState} from 'react';
import {useDialogsProps} from '@/states/temporary/dialogs';
import {useNavigation} from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import {View} from 'react-native';
import {useSettings} from '@/states/persistent/settings';
import {useTheme} from '@/theme';
import MultiIcon from '@/components/multiIcon';

type HomeLayoutType = 'categories' | 'list' | 'grid';

export default function HomeLayoutPickerDialog({
  activeDialog,
  defaultDialogProps,
  openDialog,
  closeDialog,
}: useDialogsProps) {
  const {layout, setSetting} = useSettings(state => ({
    layout: state.settings.layout.homeStyle,
    setSetting: state.setSetting,
  }));
  const [previousLayout, setPreviousLayout] = useState<HomeLayoutType>(layout);
  const [opacity, setOpacity] = useState(1);
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    if (activeDialog !== 'homeLayoutPicker') return;
    setPreviousLayout(layout);
  }, [activeDialog]);

  return (
    <Portal>
      <Dialog
        style={{
          opacity: opacity,
        }}
        dismissable={false}
        dismissableBackButton={false}
        visible={activeDialog === 'homeLayoutPicker'}
        onDismiss={() => closeDialog()}>
        <Dialog.Title>Layout</Dialog.Title>
        <Dialog.Content
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SegmentedButtons
            style={{
              marginVertical: 15,
            }}
            value={layout}
            onValueChange={value =>
              setSetting('layout', 'homeStyle', value as HomeLayoutType)
            }
            buttons={[
              {
                value: 'categories',
                icon: props => (
                  <MultiIcon
                    {...props}
                    size={24}
                    type="material-community"
                    name="format-list-text"
                  />
                ),
              },
              {
                value: 'list',
                icon: props => (
                  <MultiIcon
                    {...props}
                    size={24}
                    type="material-community"
                    name="view-list"
                  />
                ),
              },
              {
                value: 'grid',
                icon: props => (
                  <MultiIcon
                    {...props}
                    size={24}
                    type="material-community"
                    name="view-grid"
                  />
                ),
              },
            ]}
          />
          <View
            style={{
              marginTop: 15,
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: theme.schemedTheme.secondaryContainer,
              borderColor: theme.schemedTheme.outline,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 12,
            }}>
            <Slider
              minimumValue={0.25}
              style={{
                width: 250,
              }}
              value={opacity}
              onValueChange={value => setOpacity(value)}
              minimumTrackTintColor={theme.schemedTheme.onSecondaryContainer}
              maximumTrackTintColor={theme.schemedTheme.outline}
              thumbTintColor={theme.schemedTheme.onSecondaryContainer}
            />
            <Text
              style={{
                fontSize: 15,
                color: theme.schemedTheme.onSecondaryContainer,
              }}>
              Opacity
            </Text>
          </View>
        </Dialog.Content>
        <Dialog.Actions style={{justifyContent: 'space-between'}}>
          <Button
            onPress={() => {
              setSetting('layout', 'homeStyle', previousLayout);
              closeDialog();
              navigation.navigate('Settings' as never);
            }}>
            Cancel
          </Button>
          <Button
            onPress={() => {
              closeDialog();
              navigation.navigate('Settings' as never);
            }}>
            Apply
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
