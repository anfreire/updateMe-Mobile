import React, { useEffect, useState, useCallback } from "react";
import { Button, Dialog, SegmentedButtons } from "react-native-paper";
import { useDialogsProps } from "@/states/temporary/dialogs";
import { SavedColorSchemeType, useTheme } from "@/theme";
import MultiIcon from "@/components/multiIcon";
import { useSettings } from "@/states/persistent/settings";
import { IconProps } from "react-native-paper/lib/typescript/components/MaterialCommunityIcon";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { StyleSheet } from "react-native";

const colorSchemeOptions = [
	{
		label: "System",
		value: "system",
		icon: ((props: IconProps) => (
			<MultiIcon {...props} type="material-icons" name="memory" />
		)) as IconSource,
	},
	{
		label: "Light",
		value: "light",
		icon: ((props: IconProps) => (
			<MultiIcon {...props} type="material-icons" name="light-mode" />
		)) as IconSource,
	},
	{
		label: "Dark",
		value: "dark",
		icon: ((props: IconProps) => (
			<MultiIcon {...props} type="material-icons" name="dark-mode" />
		)) as IconSource,
	},
];

export default function ColorSchemePickerDialog({
	activeDialog,
	closeDialog,
}: useDialogsProps) {
	const colorScheme = useSettings(
		(state) => state.settings.theme.colorScheme,
	);
	const [savedColorScheme, setSavedColorScheme] = useState(colorScheme);
	const { setColorScheme } = useTheme();

	useEffect(() => {
		if (activeDialog === "colorSchemePicker") {
			setSavedColorScheme(colorScheme);
		}
	}, [activeDialog, colorScheme]);

	const handleColorSchemeChange = useCallback(
		(value: SavedColorSchemeType) => {
			setColorScheme(value);
		},
		[setColorScheme],
	);

	const handleRevert = useCallback(() => {
		setColorScheme(savedColorScheme);
		closeDialog();
	}, [setColorScheme, savedColorScheme, closeDialog]);

	if (activeDialog !== "colorSchemePicker") return null;

	return (
		<Dialog visible onDismiss={closeDialog}>
			<Dialog.Title>Color Scheme</Dialog.Title>
			<Dialog.Content>
				<SegmentedButtons
					style={styles.segmentedButtons}
					value={colorScheme}
					onValueChange={
						handleColorSchemeChange as (value: string) => void
					}
					buttons={colorSchemeOptions}
				/>
			</Dialog.Content>
			<Dialog.Actions style={styles.dialogActions}>
				<Button onPress={handleRevert}>Revert</Button>
				<Button onPress={closeDialog}>Apply</Button>
			</Dialog.Actions>
		</Dialog>
	);
}

const styles = StyleSheet.create({
	segmentedButtons: {
		marginVertical: 15,
	},
	dialogActions: {
		justifyContent: "space-between",
	},
});
