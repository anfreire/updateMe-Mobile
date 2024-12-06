import React from 'react';
import {Button, Dialog, SegmentedButtons} from 'react-native-paper';
import {SavedColorSchemeType, useTheme} from '@/theme';
import {Translation, useTranslations} from '@/stores/persistent/translations';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';
import {buildMultiIcon} from '@/common/components/MultiIcon';
import {useSettings} from '@/stores/persistent/settings';
import {useDialogs} from '@/stores/runtime/dialogs';
import {Logger} from '@/stores/persistent/logs';
import {StyleSheet} from 'react-native';

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
    icon: buildMultiIcon('memory', 'material-icons'),
  },
  {
    label: 'Light',
    value: 'light',
    icon: buildMultiIcon('light-mode', 'material-icons'),
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: buildMultiIcon('dark-mode', 'material-icons'),
  },
] as const;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const ColorSchemeDialog = () => {
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
    marginVertical: 20,
  },
  dialogActions: {
    justifyContent: 'space-around',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(ColorSchemeDialog);
