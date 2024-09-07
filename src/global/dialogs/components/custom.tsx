import * as React from "react";
import { Button, Dialog, Text } from "react-native-paper";
import { useDialogs } from "@/states/runtime/dialogs";
import { useShallow } from "zustand/react/shallow";

const CustomDialog = () => {
  const [activeDialog, customDialog, closeDialog] = useDialogs(
    useShallow((state) => [
      state.activeDialog,
      state.customDialog,
      state.closeDialog,
    ])
  );

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
