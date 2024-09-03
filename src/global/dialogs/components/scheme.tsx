import * as React from "react";
import { Button, Dialog, SegmentedButtons } from "react-native-paper";
import { useDialogs } from "@/states/runtime/dialogs";
import { SavedColorSchemeType, useTheme } from "@/theme";
import MultiIcon from "@/components/multiIcon";
import { useSettings } from "@/states/persistent/settings";
import { IconProps } from "react-native-paper/lib/typescript/components/MaterialCommunityIcon";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { StyleSheet } from "react-native";
import { useTranslations } from "@/states/persistent/translations";

const ColorSchemePickerDialog = () => {
	const colorScheme = useSettings(
		(state) => state.settings.theme.colorScheme,
	);
	const savedColorScheme = React.useRef<SavedColorSchemeType>(colorScheme);
	const { setColorScheme } = useTheme();
	const translations = useTranslations((state) => state.translations);
	const [activeDialog, closeDialog] = useDialogs((state) => [
		state.activeDialog,
		state.closeDialog,
	]);

	const colorSchemeOptions: {
		label: string;
		value: SavedColorSchemeType;
		icon: IconSource;
	}[] = React.useMemo(
		() => [
			{
				label: translations["System"],
				value: "system",
				icon: (props) => (
					<MultiIcon {...props} type="material-icons" name="memory" />
				),
			},
			{
				label: translations["Light"],
				value: "light",
				icon: (props) => (
					<MultiIcon
						{...props}
						type="material-icons"
						name="light-mode"
					/>
				),
			},
			{
				label: translations["Dark"],
				value: "dark",
				icon: (props) => (
					<MultiIcon
						{...props}
						type="material-icons"
						name="dark-mode"
					/>
				),
			},
		],
		[translations],
	);

	React.useEffect(() => {
		if (activeDialog === "colorSchemePicker") {
			savedColorScheme.current = colorScheme;
		}
	}, [activeDialog]);

	const handleColorSchemeChange = React.useCallback(
		(value: SavedColorSchemeType) => {
			setColorScheme(value);
		},
		[],
	);

	const handleRevert = React.useCallback(() => {
		setColorScheme(savedColorScheme.current);
		closeDialog();
	}, [savedColorScheme]);

	return (
		<Dialog
			visible={activeDialog === "colorSchemePicker"}
			onDismiss={handleRevert}
		>
			<Dialog.Title>{translations["Color Scheme"]}</Dialog.Title>
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
				<Button onPress={handleRevert}>{translations["Revert"]}</Button>
				<Button onPress={closeDialog}>{translations["Save"]}</Button>
			</Dialog.Actions>
		</Dialog>
	);
};

const styles = StyleSheet.create({
	segmentedButtons: {
		marginVertical: 15,
	},
	dialogActions: {
		justifyContent: "space-between",
	},
});

ColorSchemePickerDialog.displayName = "ColorSchemePickerDialog";

export default ColorSchemePickerDialog;
