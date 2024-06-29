import {Image} from 'react-native';
import {Button, Dialog, Portal} from 'react-native-paper';
import {Dimensions} from 'react-native';
import {Share as RNShare} from 'react-native';
import {useDialogsProps} from '@/states/temporary/dialogs';
import {useApp} from '@/states/temporary/app';

const qrcode = require('@assets/QRCODE.png');

export default function ShareDialog({
  activeDialog,
  defaultDialogProps,
  openDialog,
  closeDialog,
}: useDialogsProps) {
  const info = useApp(state => state.info);
  const share = () => {
    RNShare.share(
      {
        message: info.download,
        title: 'UpdateMe Download Link',
      },
      {
        dialogTitle: 'UpdateMe Download Link',
      },
    );
  };
  return (
    <Portal>
      <Dialog
        style={{position: 'relative'}}
        visible={activeDialog === 'share'}
        onDismiss={closeDialog}>
        <Dialog.Title>Share</Dialog.Title>
        <Dialog.Content
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            marginTop: 20,
            marginBottom: 20,
            gap: 20,
          }}>
          <Image
            source={qrcode}
            resizeMode="contain"
            style={{
              height: Dimensions.get('window').width * 0.55,
              width: Dimensions.get('window').width * 0.55,
            }}
          />
          <Button mode="contained-tonal" onPress={share}>
            Share the download link
          </Button>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={closeDialog}>Done</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
