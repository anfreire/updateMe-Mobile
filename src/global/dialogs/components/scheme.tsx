import * as React from 'react';
import {Button, Dialog, SegmentedButtons} from 'react-native-paper';
import {useDialogs} from '@/states/runtime/dialogs';
import {SavedColorSchemeType, useTheme} from '@/theme';
import MultiIcon from '@/components/MultiIcon';
import {useSettings} from '@/states/persistent/settings';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';
import {StyleSheet} from 'react-native';
import {useTranslations} from '@/states/persistent/translations';
import {Logger} from '@/states/persistent/logs';
import {Translation} from '@/types/translations';

const colorSchemeOptions: {
  label: Translation;
  value: SavedColorSchemeType;
  icon: IconSource;
}[] = [
  {
    label: 'System',
    value: 'system',
    icon: props => <MultiIcon {...props} type="material-icons" name="memory" />,
  },
  {
    label: 'Light',
    value: 'light',
    icon: props => (
      <MultiIcon {...props} type="material-icons" name="light-mode" />
    ),
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: props => (
      <MultiIcon {...props} type="material-icons" name="dark-mode" />
    ),
  },
];

const ColorSchemePickerDialog = () => {
  const colorScheme = useSettings(
    state => state.settings.appearance.colorScheme,
  );
  const initialColorScheme = React.useRef<SavedColorSchemeType | null>(null);
  const {setColorScheme} = useTheme();
  const translations = useTranslations(state => state.translations);
  const [activeDialog, closeDialog] = useDialogs(state => [
    state.activeDialog,
    state.closeDialog,
  ]);

  React.useEffect(() => {
    if (activeDialog !== 'colorSchemePicker') {
      initialColorScheme.current = null;
      return;
    }
    if (initialColorScheme.current === null) {
      initialColorScheme.current = colorScheme;
    }
  }, [activeDialog, colorScheme]);

  const handleColorSchemeChange = React.useCallback(
    (value: SavedColorSchemeType) => {
      setColorScheme(value);
    },
    [setColorScheme],
  );

  const handleRevert = React.useCallback(() => {
    if (initialColorScheme.current === null) {
      Logger.error('Initial color scheme is null, cannot revert');
      return;
    }
    setColorScheme(initialColorScheme.current);
    closeDialog();
  }, [setColorScheme]);

  const translatedColorSchemeOptions = React.useMemo(
    () =>
      colorSchemeOptions.map(option => ({
        ...option,
        label: translations[option.label],
      })),
    [translations],
  );

  return (
    <Dialog
      visible={activeDialog === 'colorSchemePicker'}
      onDismiss={handleRevert}>
      <Dialog.Title>{translations['Color Scheme']}</Dialog.Title>
      <Dialog.Content>
        <SegmentedButtons
          style={styles.segmentedButtons}
          value={colorScheme}
          onValueChange={handleColorSchemeChange as (value: string) => void}
          buttons={translatedColorSchemeOptions}
        />
      </Dialog.Content>
      <Dialog.Actions style={styles.dialogActions}>
        <Button onPress={handleRevert}>{translations['Revert']}</Button>
        <Button onPress={closeDialog}>{translations['Save']}</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  segmentedButtons: {
    marginVertical: 15,
  },
  dialogActions: {
    justifyContent: 'space-between',
  },
});

ColorSchemePickerDialog.displayName = 'ColorSchemePickerDialog';

export default ColorSchemePickerDialog;
