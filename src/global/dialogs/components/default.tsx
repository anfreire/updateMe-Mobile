import { Button, Dialog, Text } from "react-native-paper";
import { useDialogsProps } from "@/states/temporary/dialogs";
import { useCallback } from "react";

export default function DefaultDialog({
	activeDialog,
	defaultDialogProps,
	closeDialog,
}: useDialogsProps) {
	const handleActionPress = useCallback(
		(action: () => void) => {
			action();
			closeDialog();
		},
		[closeDialog],
	);

	if (activeDialog !== "default" || !defaultDialogProps) {
		return null;
	}

	return (
		<Dialog visible={activeDialog === "default"} onDismiss={closeDialog}>
			<Dialog.Title>{defaultDialogProps?.title}</Dialog.Title>
			<Dialog.Content>
				<Text variant="bodyMedium">{defaultDialogProps?.content}</Text>
			</Dialog.Content>
			<Dialog.Actions>
				{defaultDialogProps?.actions.map((action, index) => (
					<Button
						key={index}
						onPress={() => handleActionPress(action.action)}
					>
						{action.title}
					</Button>
				))}
			</Dialog.Actions>
		</Dialog>
	);
}
