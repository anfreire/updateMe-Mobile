import * as React from "react";
import { Button, Dialog, Text } from "react-native-paper";
import { ActiveDialogType, useDialogs } from "@/states/temporary/dialogs";
export default function DefaultDialog({
  activeDialog,
}: {
  activeDialog: ActiveDialogType;
}) {
  const [closeDialog, defaultDialogProps] = useDialogs((state) => [
    state.closeDialog,
    state.defaultDialogProps,
  ]);

  const handleActionPress = useCallback((action: () => void) => {
    action();
    closeDialog();
  }, []);

  if (activeDialog !== "default" || !defaultDialogProps) {
    return null;
  }

  return (
    <Dialog visible onDismiss={closeDialog}>
      <Dialog.Title>{defaultDialogProps?.title}</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{defaultDialogProps?.content}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        {defaultDialogProps?.actions.map((action, index) => (
          <Button key={index} onPress={() => handleActionPress(action.action)}>
            {action.title}
          </Button>
        ))}
      </Dialog.Actions>
    </Dialog>
  );
}
