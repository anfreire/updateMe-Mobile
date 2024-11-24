import * as React from 'react';
import {Button, Dialog, Text} from 'react-native-paper';
import {useDialogs} from '@/states/runtime/dialogs';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/
function useCustomDialog() {
  const [customDialog, closeDialog] = useDialogs(state => [
    state.customDialog,
    state.closeDialog,
  ]);

  const handleActionPress = React.useCallback((action: () => void) => {
    action();
    closeDialog();
  }, []);

  return {customDialog, closeDialog, handleActionPress};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const CustomDialog = () => {
  const {customDialog, closeDialog, handleActionPress} = useCustomDialog();

  return (
    <Dialog visible onDismiss={closeDialog}>
      <Dialog.Title>{customDialog?.title}</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{customDialog?.content}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        {customDialog?.actions.map((action, index) => (
          <Button
            key={index}
            onPress={handleActionPress.bind(null, action.action)}>
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

export default React.memo(CustomDialog);
