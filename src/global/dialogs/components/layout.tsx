import * as React from 'react';
import {Button, Dialog, SegmentedButtons, Text} from 'react-native-paper';
import {useDialogs} from '@/states/runtime/dialogs';
import Slider from '@react-native-community/slider';
import {StyleSheet, View} from 'react-native';
import {useSettings} from '@/states/persistent/settings';
import {useTheme} from '@/theme';
import MultiIcon from '@/components/multiIcon';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';
import {useTranslations} from '@/states/persistent/translations';
import {NavigationProps} from '@/types/navigation';
import {Settings} from '@/types/settings';
import {Logger} from '@/states/persistent/logs';

type HomeLayoutType = Settings['layout']['homeStyle'];

const Buttons: {value: HomeLayoutType; icon: IconSource}[] = [
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
] as const;

const HomeLayoutPickerDialog = ({
  navigate,
}: {
  navigate: NavigationProps['navigate'];
}) => {
  const [activeDialog, closeDialog] = useDialogs(state => [
    state.activeDialog,
    state.closeDialog,
  ]);
  const [layout, setSetting] = useSettings(state => [
    state.settings.layout.homeStyle,
    state.setSetting,
  ]);
  const translations = useTranslations(state => state.translations);

  const {schemedTheme} = useTheme();

  const previousLayout = React.useRef<HomeLayoutType | null>(null);
  const [opacity, setOpacity] = React.useState(1);

  React.useEffect(() => {
    if (
      activeDialog === 'homeLayoutPicker' &&
      previousLayout.current === null
    ) {
      previousLayout.current = layout;
      navigate('home');
    } else if (activeDialog !== 'homeLayoutPicker') {
      previousLayout.current = null;
    }
  }, [activeDialog, layout, navigate]);

  const handleLayoutChange = React.useCallback((value: string) => {
    setSetting('layout', 'homeStyle', value as HomeLayoutType);
  }, []);

  const handleCancel = React.useCallback(() => {
    if (previousLayout.current === null) {
      Logger.error("Previous layout is null. Can't revert to previous layout");
      return;
    }
    setSetting('layout', 'homeStyle', previousLayout.current);
    closeDialog();
    navigate('settings');
  }, [navigate]);

  const handleApply = React.useCallback(() => {
    closeDialog();
    navigate('settings');
  }, [navigate]);

  if (activeDialog !== 'homeLayoutPicker') return null;

  return (
    <Dialog visible onDismiss={handleCancel} style={{opacity}}>
      <Dialog.Title>{translations['Layout']}</Dialog.Title>
      <Dialog.Content style={styles.content}>
        <SegmentedButtons
          style={styles.segmentedButtons}
          value={layout}
          onValueChange={handleLayoutChange}
          buttons={Buttons}
        />
        <View
          style={[
            styles.sliderContainer,
            {
              backgroundColor: schemedTheme.secondaryContainer,
              borderColor: schemedTheme.outline,
            },
          ]}>
          <Slider
            minimumValue={0.25}
            style={styles.slider}
            value={opacity}
            onValueChange={setOpacity}
            minimumTrackTintColor={schemedTheme.onSecondaryContainer}
            maximumTrackTintColor={schemedTheme.outline}
            thumbTintColor={schemedTheme.onSecondaryContainer}
          />
          <Text
            style={[
              styles.opacityText,
              {color: schemedTheme.onSecondaryContainer},
            ]}>
            {translations['Opacity']}
          </Text>
        </View>
      </Dialog.Content>
      <Dialog.Actions style={styles.actions}>
        <Button onPress={handleCancel}>{translations['Cancel']}</Button>
        <Button onPress={handleApply}>{translations['Save']}</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedButtons: {
    marginVertical: 15,
  },
  sliderContainer: {
    marginTop: 15,
    borderWidth: 1,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  slider: {
    width: 250,
  },
  opacityText: {
    fontSize: 15,
  },
  actions: {
    justifyContent: 'space-between',
  },
});

HomeLayoutPickerDialog.displayName = 'HomeLayoutPickerDialog';

export default HomeLayoutPickerDialog;
