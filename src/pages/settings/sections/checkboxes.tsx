import MultiIcon, { MultiIconType } from "@/components/multiIcon";
import {
	SettingsSectionItemType,
	SettingsSectionType,
	useSettings,
} from "@/states/persistent/settings";
import { useTranslations } from "@/states/persistent/translations";
import { useEffect, useMemo } from "react";
import { FlatList } from "react-native";
import { Checkbox, List } from "react-native-paper";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

export type CheckboxTitle =
	| "Install Express"
	| "Fresh Start"
	| "Risk Taker"
	| "Update Junkie"
	| "Frontline Fan";

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

export interface CheckboxItem<
	T extends SettingsSectionType,
	K extends SettingsSectionItemType<T>,
> {
	title: string;
	description: string;
	setting: {
		section: T;
		item: K;
	};
	icon: {
		name: string;
		type: MultiIconType;
	};
}

export default function SettingsCheckboxes({
	pulsingSetting,
}: {
	pulsingSetting: string | undefined;
}) {
	const translations = useTranslations();
	const [settings, toggleSetting] = useSettings((state) => [
		state.settings,
		state.toggleSetting,
	]);

	const opacity = useSharedValue(1);

	const pulsingStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
		};
	});

	useEffect(() => {
		if (!pulsingSetting) return;

		opacity.value = withRepeat(
			withTiming(0.5, {
				duration: 600,
				easing: Easing.inOut(Easing.quad),
			}),
			-1,
			true,
		);

		setTimeout(() => {
			opacity.value = 1;
		}, 2500);
	}, [pulsingSetting]);

	const settingsValues = useMemo(
		() => [
			{
				title: translations["Downloads"],
				items: [
					{
						title: translations["Install Express"],
						description:
							translations["Install the app after downloading"],
						setting: {
							section: "downloads",
							item: "installAfterDownload",
						},
						icon: {
							name: "install-mobile",
							type: "material-icons",
						},
					} as CheckboxItem<"downloads", "installAfterDownload">,
					{
						title: translations["Fresh Start"],
						description:
							translations[
								"Delete all downloads when leaving the app"
							],
						setting: {
							section: "downloads",
							item: "deleteOnLeave",
						},
						icon: {
							name: "delete-sweep",
							type: "material-icons",
						},
					} as CheckboxItem<"downloads", "deleteOnLeave">,
				],
			},
			{
				title: translations["Notifications"],
				items: [
					{
						title: translations["Update Junkie"],
						description:
							translations[
								"Get notified when there are installed apps updates"
							],
						setting: {
							section: "notifications",
							item: "updatesNotification",
						},
						icon: {
							name: "update",
							type: "material-icons",
						},
					} as CheckboxItem<"notifications", "updatesNotification">,
					{
						title: translations["Frontline Fan"],
						description:
							translations[
								"Get notified when there is a new UpdateMe release"
							],
						setting: {
							section: "notifications",
							item: "newReleaseNotification",
						},
						icon: {
							name: "new-releases",
							type: "material-icons",
						},
					} as CheckboxItem<
						"notifications",
						"newReleaseNotification"
					>,
				],
			},
			{
				title: translations["Security"],
				items: [
					{
						title: translations["Risk Taker"],
						description:
							translations["Install potentially unsafe apps"],
						setting: {
							section: "security",
							item: "installUnsafeApps",
						},
						icon: {
							name: "shield-off",
							type: "material-community",
						},
					} as CheckboxItem<"security", "installUnsafeApps">,
				],
			},
		],
		[translations],
	);
	return (
		<FlatList
			data={settingsValues}
			renderItem={({ item }) => (
				<List.Section key={item.title} title={item.title}>
					{item.items.map((item) => (
						<AnimatedListItem
							key={item.title}
							title={item.title}
							description={item.description}
							style={
								item.title === pulsingSetting
									? pulsingStyle
									: {}
							}
							left={(props: any) => (
								<MultiIcon
									{...props}
									size={20}
									type={item.icon.type}
									name={item.icon.name}
								/>
							)}
							right={(props: any) => (
								<Checkbox
									{...props}
									status={
										settings[
											item.setting
												.section as SettingsSectionType
										][
											item.setting
												.item as SettingsSectionItemType<SettingsSectionType>
										]
											? "checked"
											: "unchecked"
									}
								/>
							)}
							onPress={() =>
								toggleSetting(
									item.setting.section as SettingsSectionType,
									item.setting
										.item as SettingsSectionItemType<SettingsSectionType>,
								)
							}
						/>
					))}
				</List.Section>
			)}
			keyExtractor={(item) => item.title}
		/>
	);
}
