import { Button, Dialog, SegmentedButtons, Text } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import { useDialogs } from "@/states/temporary/dialogs";
import Slider from "@react-native-community/slider";
import { StyleSheet, View } from "react-native";
import { SettingsProps, useSettings } from "@/states/persistent/settings";
import { useTheme } from "@/theme";
import MultiIcon, { MultiIconType } from "@/components/multiIcon";
import { IconProps } from "react-native-paper/lib/typescript/components/MaterialCommunityIcon";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { useShallow } from "zustand/react/shallow";
import { useSilentNavigate } from "@/hooks/navigation";
import { useTranslations } from "@/states/persistent/translations";

type HomeLayoutType = SettingsProps["layout"]["homeStyle"];

const Buttons: { value: HomeLayoutType; icon: IconSource }[] = [
	{
		value: "categories",
		icon: ((props: IconProps & { color: string }) => (
			<MultiIcon
				{...props}
				size={24}
				type="material-community"
				name="format-list-text"
			/>
		)) as IconSource,
	},
	{
		value: "list",
		icon: ((props: IconProps & { color: string }) => (
			<MultiIcon
				{...props}
				size={24}
				type="material-community"
				name="view-list"
			/>
		)) as IconSource,
	},
	{
		value: "grid",
		icon: ((props: IconProps & { color: string }) => (
			<MultiIcon
				{...props}
				size={24}
				type="material-community"
				name="view-grid"
			/>
		)) as IconSource,
	},
] as const;

export default function HomeLayoutPickerDialog() {
	const [activeDialog, closeDialog] = useDialogs(
		useShallow((state) => [state.activeDialog, state.closeDialog]),
	);
	const [layout, setSetting] = useSettings(
		useShallow((state) => [
			state.settings.layout.homeStyle,
			state.setSetting,
		]),
	);
	const translations = useTranslations();

	const { schemedTheme } = useTheme();

	const navigate = useSilentNavigate();

	const [previousLayout, setPreviousLayout] =
		useState<HomeLayoutType>(layout);
	const [opacity, setOpacity] = useState(1);

	useEffect(() => {
		if (activeDialog === "homeLayoutPicker") {
			setPreviousLayout(layout);
		}
	}, [activeDialog, layout]);

	const handleLayoutChange = useCallback(
		(value: string) => {
			setSetting("layout", "homeStyle", value as HomeLayoutType);
		},
		[setSetting],
	);

	const handleCancel = useCallback(() => {
		setSetting("layout", "homeStyle", previousLayout);
		closeDialog();
		navigate("settings");
	}, [setSetting, previousLayout, closeDialog, navigate]);

	const handleApply = useCallback(() => {
		closeDialog();
		navigate("settings");
	}, [closeDialog, navigate]);

	if (activeDialog !== "homeLayoutPicker") return null;

	return (
		<Dialog visible onDismiss={closeDialog} style={{ opacity }}>
			<Dialog.Title>{translations["Layout"]}</Dialog.Title>
			<Dialog.Content style={styles.content}>
				<SegmentedButtons
					style={styles.segmentedButtons}
					value={layout}
					onValueChange={handleLayoutChange}
					buttons={Buttons}
				/>
				<View
					style={[
						styles.sliderContainer,
						{
							backgroundColor: schemedTheme.secondaryContainer,
							borderColor: schemedTheme.outline,
						},
					]}
				>
					<Slider
						minimumValue={0.25}
						style={styles.slider}
						value={opacity}
						onValueChange={setOpacity}
						minimumTrackTintColor={
							schemedTheme.onSecondaryContainer
						}
						maximumTrackTintColor={schemedTheme.outline}
						thumbTintColor={schemedTheme.onSecondaryContainer}
					/>
					<Text
						style={[
							styles.opacityText,
							{ color: schemedTheme.onSecondaryContainer },
						]}
					>
						{translations["Opacity"]}
					</Text>
				</View>
			</Dialog.Content>
			<Dialog.Actions style={styles.actions}>
				<Button onPress={handleCancel}>{translations["Cancel"]}</Button>
				<Button onPress={handleApply}>{translations["Save"]}</Button>
			</Dialog.Actions>
		</Dialog>
	);
}

const styles = StyleSheet.create({
	content: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	segmentedButtons: {
		marginVertical: 15,
	},
	sliderContainer: {
		marginTop: 15,
		borderWidth: 1,
		borderRadius: 10,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		padding: 12,
	},
	slider: {
		width: 250,
	},
	opacityText: {
		fontSize: 15,
	},
	actions: {
		justifyContent: "space-between",
	},
});
