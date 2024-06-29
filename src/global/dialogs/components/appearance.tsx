import * as React from 'react';
import {useEffect} from 'react';
import {Button, Dialog, IconButton, Portal} from 'react-native-paper';
import {ColorPicker, fromHsv, toHsv} from 'react-native-color-picker';
import {HsvColor} from 'react-native-color-picker/dist/typeHelpers';
import {useTheme} from '@/theme';
import {useToast} from '@/states/temporary/toast';
import {useDialogsProps} from '@/states/temporary/dialogs';

export default function SourceColorPickerDialog({
  activeDialog,
  defaultDialogProps,
  openDialog,
  closeDialog,
}: useDialogsProps) {
  const theme = useTheme();
  const {openToast, closeToast} = useToast(state => ({
    openToast: state.openToast,
    closeToast: state.closeToast,
  }));
  const [oldColor, setOldColor] = React.useState('');
  const [activeColor, setActiveColor] = React.useState<HsvColor>({
    h: 0,
    s: 0,
    v: 0,
  });

  const close = () => {
    closeDialog();
    setOldColor('');
    closeToast();
  };

  useEffect(() => {
    if (activeDialog === 'sourceColorPicker') {
      setOldColor(theme.sourceColor);
      setActiveColor(toHsv(theme.sourceColor));
    }
  }, [activeDialog]);

  return (
    <Portal>
      <Dialog
        style={{position: 'relative'}}
        visible={activeDialog === 'sourceColorPicker'}
        dismissable={false}
        dismissableBackButton={false}
        onDismiss={close}>
        <IconButton
          style={{
            position: 'absolute',
            top: -10,
            right: 0,
            zIndex: 1000,
          }}
          icon="information"
          onPress={() =>
            openToast('Tap on the middle circle to test the color')
          }
        />
        <Dialog.Title>Source Color</Dialog.Title>
        <Dialog.Content
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
          }}>
          <ColorPicker
            color={activeColor}
            onColorSelected={color => theme.setSourceColor(color)}
            defaultColor={oldColor}
            style={{width: 300, height: 300}}
            hideSliders={true}
            onColorChange={color => setActiveColor(color)}
          />
        </Dialog.Content>
        <Dialog.Actions
          style={{
            justifyContent: 'space-around',
          }}>
          <Button
            onPress={() => {
              theme.setSourceColor(oldColor);
              close();
            }}>
            Cancel
          </Button>
          <Button
            onPress={() => {
              theme.resetSourceColor();
              close();
            }}>
            Use System
          </Button>
          <Button
            onPress={() => {
              theme.setSourceColor(fromHsv(activeColor));
              close();
            }}>
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
