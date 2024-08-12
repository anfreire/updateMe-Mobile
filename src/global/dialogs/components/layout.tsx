import { Button, Dialog, SegmentedButtons, Text } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import { useDialogsProps } from "@/states/temporary/dialogs";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import { StyleSheet, View } from "react-native";
import { useSettings } from "@/states/persistent/settings";
import { useTheme } from "@/theme";
import MultiIcon from "@/components/multiIcon";
import { IconProps } from "react-native-paper/lib/typescript/components/MaterialCommunityIcon";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

type HomeLayoutType = "categories" | "list" | "grid";

const buttons = [
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
];

export default function HomeLayoutPickerDialog({
	activeDialog,
	closeDialog,
}: useDialogsProps) {
	const { layout, setSetting } = useSettings((state) => ({
		layout: state.settings.layout.homeStyle,
		setSetting: state.setSetting,
	}));
	const [previousLayout, setPreviousLayout] =
		useState<HomeLayoutType>(layout);
	const [opacity, setOpacity] = useState(1);
	const { navigate } = useNavigation();
	const { schemedTheme } = useTheme();

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
		navigate("Settings" as never);
	}, [setSetting, previousLayout, closeDialog, navigate]);

	const handleApply = useCallback(() => {
		closeDialog();
		navigate("Settings" as never);
	}, [closeDialog, navigate]);

	if (activeDialog !== "homeLayoutPicker") return null;

	return (
		<Dialog visible={true} onDismiss={closeDialog} style={{ opacity }}>
			<Dialog.Title>Layout</Dialog.Title>
			<Dialog.Content style={styles.content}>
				<SegmentedButtons
					style={styles.segmentedButtons}
					value={layout}
					onValueChange={handleLayoutChange}
					buttons={buttons}
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
						Opacity
					</Text>
				</View>
			</Dialog.Content>
			<Dialog.Actions style={styles.actions}>
				<Button onPress={handleCancel}>Cancel</Button>
				<Button onPress={handleApply}>Apply</Button>
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
