import * as React from 'react';
import {Button, Dialog, Text} from 'react-native-paper';
import {useDialogs} from '@/states/runtime/dialogs';
import {useShallow} from 'zustand/react/shallow';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/
function useCustomDialog() {
  const [activeDialog, customDialog, closeDialog] = useDialogs(
    useShallow(state => [
      state.activeDialog,
      state.customDialog,
      state.closeDialog,
    ]),
  );

  const handleActionPress = React.useCallback((action: () => void) => {
    action();
    closeDialog();
  }, []);

  return {activeDialog, customDialog, closeDialog, handleActionPress};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const CustomDialog = () => {
  const {activeDialog, customDialog, closeDialog, handleActionPress} =
    useCustomDialog();

  if (activeDialog !== 'custom' || !customDialog) {
    return null;
  }

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
