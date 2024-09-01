import * as React from "react";
import { Button, Dialog, Text } from "react-native-paper";
import { useDialogs } from "@/states/runtime/dialogs";

const CustomDialog = () => {
  const [activeDialog, closeDialog, customDialog] = useDialogs((state) => [
    state.activeDialog,
    state.closeDialog,
    state.customDialog,
  ]);

  const handleActionPress = React.useCallback((action: () => void) => {
    action();
    closeDialog();
  }, []);

  if (activeDialog !== "custom" || !customDialog) {
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
          <Button key={index} onPress={() => handleActionPress(action.action)}>
            {action.title}
          </Button>
        ))}
      </Dialog.Actions>
    </Dialog>
  );
};

CustomDialog.displayName = "CustomDialog";

export default CustomDialog;
