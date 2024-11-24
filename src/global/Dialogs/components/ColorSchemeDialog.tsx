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

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

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

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useColorSchemePickerDialog() {
  const colorScheme = useSettings(
    state => state.settings.appearance.colorScheme,
  );
  const initialColorScheme = React.useRef<SavedColorSchemeType>(colorScheme);
  const {setColorScheme} = useTheme();
  const translations = useTranslations(state => state.translations);
  const closeDialog = useDialogs(state => state.closeDialog);

  const labels = React.useMemo(
    () => ({
      title: translations['Color Scheme'],
      revert: translations['Revert'],
      save: translations['Save'],
    }),
    [translations],
  );

  const translatedColorSchemeOptions = React.useMemo(
    () =>
      colorSchemeOptions.map(option => ({
        ...option,
        label: translations[option.label],
      })),
    [translations],
  );

  const handleColorSchemeChange = React.useCallback(
    (value: SavedColorSchemeType) => {
      setColorScheme(value);
    },
    [setColorScheme],
  );

  const handleRevert = React.useCallback(() => {
    if (initialColorScheme.current === null) {
      Logger.error(
        'Color Scheme Picker',
        'Revert Changes',
        'Initial color scheme is null. This should not happen',
      );
      return;
    }
    setColorScheme(initialColorScheme.current);
    closeDialog();
  }, [setColorScheme]);

  return {
    colorScheme,
    labels,
    translatedColorSchemeOptions,
    handleColorSchemeChange,
    handleRevert,
    closeDialog,
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const ColorSchemePickerDialog = () => {
  const {
    colorScheme,
    labels,
    translatedColorSchemeOptions,
    handleColorSchemeChange,
    handleRevert,
    closeDialog,
  } = useColorSchemePickerDialog();

  return (
    <Dialog
      visible
      onDismiss={undefined}
      dismissable={false}
      dismissableBackButton={false}>
      <Dialog.Title>{labels.title}</Dialog.Title>
      <Dialog.Content>
        <SegmentedButtons
          style={styles.segmentedButtons}
          value={colorScheme}
          onValueChange={handleColorSchemeChange as (value: string) => void}
          buttons={translatedColorSchemeOptions}
        />
      </Dialog.Content>
      <Dialog.Actions style={styles.dialogActions}>
        <Button onPress={handleRevert}>{labels.revert}</Button>
        <Button onPress={closeDialog}>{labels.save}</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  segmentedButtons: {
    marginVertical: 15,
  },
  dialogActions: {
    justifyContent: 'space-between',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(ColorSchemePickerDialog);
