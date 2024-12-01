import {useDialogs} from '@/stores/runtime/dialogs';
import React, {memo, useMemo} from 'react';
import {Button, Dialog, Text} from 'react-native-paper';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const CustomDialog = () => {
  const [customDialog, closeDialog] = useDialogs(state => [
    state.customDialog,
    state.closeDialog,
  ]);

  const dialogActions = useMemo(() => {
    return customDialog
      ? customDialog.actions.map(action => ({
          title: action.title,
          onPress: () => {
            action.onPress();
            closeDialog();
          },
        }))
      : [];
  }, [customDialog]);

  return (
    <Dialog visible onDismiss={closeDialog}>
      <Dialog.Title>{customDialog?.title}</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{customDialog?.content}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        {dialogActions.map((action, index) => (
          <Button key={index} onPress={action.onPress}>
            {action.title}
          </Button>
        ))}
      </Dialog.Actions>
    </Dialog>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(CustomDialog);
