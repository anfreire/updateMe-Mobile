import {Button, Dialog, Portal, Text} from 'react-native-paper';
import {useDialogsProps} from '@/states/temporary/dialogs';

export default function DefaultDialog({
  activeDialog,
  defaultDialogProps,
  openDialog,
  closeDialog,
}: useDialogsProps) {
  return (
    <Portal>
      <Dialog visible={activeDialog === 'default'} onDismiss={closeDialog}>
        <Dialog.Title>{defaultDialogProps?.title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{defaultDialogProps?.content}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          {defaultDialogProps?.actions.map((action, index) => (
            <Button
              key={index}
              onPress={() => {
                action.action();
                closeDialog();
              }}>
              {action.title}
            </Button>
          ))}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
