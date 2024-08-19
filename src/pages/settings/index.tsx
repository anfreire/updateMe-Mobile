import { ScrollView } from "react-native";
import { Checkbox, List } from "react-native-paper";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import {
	SettingsSectionItemType,
	SettingsSectionType,
	useSettings,
} from "@/states/persistent/settings";
import MultiIcon, { MultiIconType } from "@/components/multiIcon";
import { useDialogs } from "@/states/temporary/dialogs";

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

export default function SettingsScreen({ route }: { route: any }) {
	const setting = route.params?.setting as undefined | SettingsTitle;
	const openDialog = useDialogs().openDialog;
	const { installAfterDownload, deleteOnLeave } =
		useSettings().settings.downloads;
	const { installUnsafeApps } = useSettings().settings.security;
	const setSetting = useSettings().setSetting;

	const opacity = useSharedValue(1);

	const animationStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
		};
	});

	const pulse = () => {
		opacity.value = withRepeat(
			withTiming(0.5, {
				duration: 600,
				easing: Easing.inOut(Easing.quad),
			}),
			-1,
			true,
		);
	};

	const stopPulsing = () => {
		opacity.value = 1;
	};

	useEffect(() => {
		pulse();
		setTimeout(() => {
			stopPulsing();
		}, 2500);
	}, [setting]);

	const settingsValues: SectionType<SettingsSectionType>[] = [
		{
			title: "Downloads",
			name: "downloads",
			items: [
				{
					onPress: () =>
						setSetting(
							"downloads",
							"installAfterDownload",
							!installAfterDownload,
						),
					title: "Install Express",
					description: "Install the app after downloading",
					name: "install-mobile",
					type: "material-icons",
					state: installAfterDownload,
				},
				{
					onPress: () =>
						setSetting(
							"downloads",
							"deleteOnLeave",
							!deleteOnLeave,
						),
					title: "Fresh Start",
					description: "Delete all downloads when leaving the app",
					name: "delete-sweep",
					type: "material-icons",
					state: deleteOnLeave,
				},
			],
		},
		{
			title: "Notifications",
			name: "notifications",
			items: [
				{
					onPress: () => {},
					title: "Update Junkie",
					description:
						"Get notified when there are installed apps updates",
					name: "update",
					type: "material-icons",
					state: true,
				},
				{
					onPress: () => {},
					title: "Frontline Fan",
					description:
						"Get notified when there is a new UpdateMe release",
					name: "new-releases",
					type: "material-icons",
					state: true,
				},
			],
		},
		{
			title: "Security",
			name: "security",
			items: [
				{
					onPress: () =>
						setSetting(
							"security",
							"installUnsafeApps",
							!installUnsafeApps,
						),
					title: "Risk Taker",
					description: "Install potentially unsafe apps",
					name: "shield-off",
					type: "material-community",
					state: installUnsafeApps,
				},
			],
		},
	];

	return (
		<ScrollView>
			<List.Section title="Appearance">
				<List.Item
					title="Chromatic Shift"
					description="Change the source color of the app"
					left={(props) => (
						<MultiIcon
							{...props}
							size={20}
							type="material-icons"
							name="palette"
						/>
					)}
					right={(props) => (
						<List.Icon {...props} icon="chevron-right" />
					)}
					onPress={() => openDialog("sourceColorPicker")}
				/>
				<List.Item
					title="Dusk till Dawn"
					description="Change the color scheme of the app"
					left={(props) => (
						<MultiIcon
							{...props}
							size={20}
							type="material-community"
							name="theme-light-dark"
						/>
					)}
					right={(props) => (
						<List.Icon {...props} icon="chevron-right" />
					)}
					onPress={() => openDialog("colorSchemePicker")}
				/>
			</List.Section>
			<List.Section title="Layout">
				<List.Item
					title="Feels like home"
					description="Change the layout of the home screen"
					left={(props) => (
						<MultiIcon
							{...props}
							size={20}
							type="feather"
							name="layout"
						/>
					)}
					right={(props) => (
						<List.Icon {...props} icon="chevron-right" />
					)}
					onPress={() => {
						navigation.navigate("Home");
						openDialog("homeLayoutPicker");
					}}
				/>
			</List.Section>
			{settingsValues.map((section) => (
				<List.Section key={section.title} title={section.title}>
					{section.items.map((item) => (
						<AnimatedListItem
							key={item.title}
							title={item.title}
							description={item.description}
							style={item.title === setting ? animationStyle : {}}
							left={(props: any) => (
								<MultiIcon
									{...props}
									size={20}
									type={item.type}
									name={item.name}
								/>
							)}
							right={(props: any) => (
								<Checkbox
									{...props}
									status={
										item.state ? "checked" : "unchecked"
									}
								/>
							)}
							onPress={item.onPress}
						/>
					))}
				</List.Section>
			))}
		</ScrollView>
	);
}
