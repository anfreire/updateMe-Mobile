import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Button, Dialog, IconButton} from 'react-native-paper';
import {ColorPicker, fromHsv, toHsv} from 'react-native-color-picker';
import {HsvColor} from 'react-native-color-picker/dist/typeHelpers';
import {useTheme} from '@/theme';
import {useToast} from '@/states/runtime/toast';
import {useDialogs} from '@/states/runtime/dialogs';
import {useTranslations} from '@/states/persistent/translations';
import {Logger} from '@/states/persistent/logs';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useSourceColorPickerDialog() {
  const {sourceColor, setSourceColor, resetSourceColor} = useTheme();
  const initialSourceColor = React.useRef<string | null>(null);
  const closeDialog = useDialogs(state => state.closeDialog);
  const [openToast, closeToast] = useToast(state => [
    state.openToast,
    state.closeToast,
  ]);
  const translations = useTranslations(state => state.translations);
  const [activeColor, setActiveColor] = React.useState<HsvColor>({
    h: 0,
    s: 0,
    v: 0,
  });

  const labels = React.useMemo(
    () => ({
      title: translations['Source Color'],
      info: translations['Tap on the middle circle to test the color'],
      cancel: translations['Revert'],
      useSystem: translations['Use System'],
      save: translations['Save'],
    }),
    [translations],
  );

  const handleClose = React.useCallback(() => {
    initialSourceColor.current = null;
    closeDialog();
    closeToast();
  }, []);

  const handleInfoPress = React.useCallback(() => {
    openToast(translations['Tap on the middle circle to test the color']);
  }, [translations]);

  const handleCancel = React.useCallback(() => {
    if (initialSourceColor.current !== null) {
      setSourceColor(initialSourceColor.current);
    } else {
      Logger.error(
        'Source Color Picker',
        'Revert Changes',
        'Initial source color is null. This should not happen',
      );
    }
    handleClose();
  }, [setSourceColor, handleClose]);

  const handleUseSystem = React.useCallback(() => {
    resetSourceColor();
    handleClose();
  }, [handleClose, resetSourceColor]);

  const handleSave = React.useCallback(() => {
    setSourceColor(fromHsv(activeColor));
    handleClose();
  }, [activeColor, handleClose, setSourceColor]);

  React.useEffect(() => {
    if (initialSourceColor.current === null) {
      initialSourceColor.current = sourceColor;
      setActiveColor(toHsv(sourceColor));
    }
  }, [sourceColor]);

  return {
    labels,
    activeColor,
    sourceColor,
    setSourceColor,
    setActiveColor,
    handleInfoPress,
    handleCancel,
    handleUseSystem,
    handleSave,
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const SourceColorPickerDialog = () => {
  const {
    labels,
    activeColor,
    sourceColor,
    setSourceColor,
    setActiveColor,
    handleInfoPress,
    handleCancel,
    handleUseSystem,
    handleSave,
  } = useSourceColorPickerDialog();

  return (
    <Dialog
      visible
      onDismiss={undefined}
      dismissable={false}
      dismissableBackButton={false}
      style={styles.dialog}>
      <IconButton
        icon="information"
        onPress={handleInfoPress}
        style={styles.infoButton}
      />
      <Dialog.Title>{labels.title}</Dialog.Title>
      <Dialog.Content style={styles.content}>
        <ColorPicker
          color={activeColor}
          onColorSelected={setSourceColor}
          defaultColor={sourceColor}
          style={styles.colorPicker}
          hideSliders
          onColorChange={setActiveColor}
        />
      </Dialog.Content>
      <Dialog.Actions style={styles.actions}>
        <Button onPress={handleCancel}>{labels.cancel}</Button>
        <Button onPress={handleUseSystem}>{labels.useSystem}</Button>
        <Button onPress={handleSave}>{labels.save}</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  dialog: {
    position: 'relative',
  },
  infoButton: {
    position: 'absolute',
    top: -10,
    right: 0,
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  colorPicker: {
    width: 300,
    height: 300,
  },
  actions: {
    justifyContent: 'space-around',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(SourceColorPickerDialog);
