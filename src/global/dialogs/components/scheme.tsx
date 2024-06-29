import {Button, Dialog, Portal, SegmentedButtons} from 'react-native-paper';
import {useEffect, useState} from 'react';
import {useDialogsProps} from '@/states/temporary/dialogs';
import {SavedColorSchemeType, useTheme} from '@/theme';
import MultiIcon from '@/components/multiIcon';
import { useSettings } from '@/states/persistent/settings';

export default function ColorSchemePickerDialog({
  activeDialog,
  defaultDialogProps,
  openDialog,
  closeDialog,
}: useDialogsProps) {
  const [savedColorScheme, setSavedColorScheme] =
    useState<SavedColorSchemeType>('system');
  const colorScheme = useSettings(state => state.settings.theme.colorScheme);
  const theme = useTheme();

  useEffect(() => {
    if (activeDialog === 'colorSchemePicker') {
      setSavedColorScheme(colorScheme);
    }
  }, [activeDialog]);

  return (
    <Portal>
      <Dialog
        dismissable={false}
        dismissableBackButton={false}
        visible={activeDialog === 'colorSchemePicker'}
        onDismiss={closeDialog}>
        <Dialog.Title>Color Scheme</Dialog.Title>
        <Dialog.Content>
          <SegmentedButtons
            style={{marginVertical: 15}}
            value={colorScheme}
            onValueChange={value =>
              theme.setColorScheme(value as SavedColorSchemeType)
            }
            buttons={[
              {
                label: 'System',
                value: 'system',
                icon: props => (
                  <MultiIcon {...props} type="material-icons" name="memory" />
                ),
              },
              {
                label: 'Light',
                value: 'light',
                icon: props => (
                  <MultiIcon
                    {...props}
                    type="material-icons"
                    name="light-mode"
                  />
                ),
              },
              {
                label: 'Dark',
                value: 'dark',
                icon: props => (
                  <MultiIcon
                    {...props}
                    type="material-icons"
                    name="dark-mode"
                  />
                ),
              },
            ]}
          />
        </Dialog.Content>
        <Dialog.Actions style={{justifyContent: 'space-between'}}>
          <Button
            onPress={() => {
              theme.setColorScheme(savedColorScheme);
              closeDialog();
            }}>
            Revert
          </Button>
          <Button onPress={closeDialog}>Apply</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
