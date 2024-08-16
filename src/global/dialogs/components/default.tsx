import { Button, Dialog, Text } from "react-native-paper";
import { useDialogs } from "@/states/temporary/dialogs";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

export default function DefaultDialog() {
	const [activeDialog, closeDialog, defaultDialogProps] = useDialogs(
		useShallow((state) => [
			state.activeDialog,
			state.closeDialog,
			state.defaultDialogProps,
		]),
	);

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
		<Dialog visible onDismiss={closeDialog}>
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
