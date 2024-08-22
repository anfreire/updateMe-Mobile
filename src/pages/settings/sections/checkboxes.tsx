import { useMemo, useCallback, memo } from "react";
import { FlatList } from "react-native";
import { Checkbox, List } from "react-native-paper";
import Animated from "react-native-reanimated";
import MultiIcon, { MultiIconType } from "@/components/multiIcon";
import {
	SettingsSectionItemType,
	SettingsSectionType,
	useSettings,
} from "@/states/persistent/settings";
import {
	Translation,
	useTranslations,
	useTranslationsProps,
} from "@/states/persistent/translations";
import { usePulsing } from "@/hooks/usePulsing";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AppsStackParams } from "@/navigation/apps";
import { MainStackParams } from "@/navigation";
import { TipsStackParams } from "@/navigation/tips";

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

interface CheckboxItem<
	S extends SettingsSectionType,
	I extends SettingsSectionItemType<S>,
> {
	title: Translation;
	description: Translation;
	setting: {
		section: S;
		item: I;
	};
	icon: {
		name: string;
		type: MultiIconType;
	};
}

interface SettingsGroup<S extends SettingsSectionType> {
	title: Translation;
	items: CheckboxItem<S, SettingsSectionItemType<S>>[];
}

const SettingsData = [
	{
		title: "Downloads",
		items: [
			{
				title: "Install Express",
				description: "Install the app after downloading",
				setting: { section: "downloads", item: "installAfterDownload" },
				icon: { name: "install-mobile", type: "material-icons" },
			},
			{
				title: "Fresh Start",
				description: "Delete all downloads when leaving the app",
				setting: { section: "downloads", item: "deleteOnLeave" },
				icon: { name: "delete-sweep", type: "material-icons" },
			},
		],
	} as SettingsGroup<"downloads">,
	{
		title: "Notifications",
		items: [
			{
				title: "Update Junkie",
				description:
					"Get notified when there are installed apps updates",
				setting: {
					section: "notifications",
					item: "updatesNotification",
				},
				icon: { name: "update", type: "material-icons" },
			},
			{
				title: "Frontline Fan",
				description:
					"Get notified when there is a new UpdateMe release",
				setting: {
					section: "notifications",
					item: "newReleaseNotification",
				},
				icon: { name: "new-releases", type: "material-icons" },
			},
		],
	} as SettingsGroup<"notifications">,
	{
		title: "Security",
		items: [
			{
				title: "Risk Taker",
				description: "Install potentially unsafe apps",
				setting: { section: "security", item: "installUnsafeApps" },
				icon: { name: "shield-off", type: "material-community" },
			},
		],
	} as SettingsGroup<"security">,
];

const SettingsCheckboxes = () => {
	const translations = useTranslations();
	const [settings, toggleSetting] = useSettings((state) => [
		state.settings,
		state.toggleSetting,
	]);
	const route =
		useRoute<
			RouteProp<AppsStackParams & MainStackParams & TipsStackParams>
		>();
	const pulsingStyle = usePulsing(!!route.params?.setting);

	const translatedSettingsData = useMemo(
		() =>
			SettingsData.map((group) => ({
				...group,
				title: translations[group.title],
				items: group.items.map((item) => ({
					...item,
					title: translations[item.title],
					description: translations[item.description],
				})),
			})),
		[translations],
	);

	return (
		<FlatList
			data={translatedSettingsData}
			keyExtractor={(item) => item.title}
			renderItem={({ item }) => (
				<List.Section title={item.title}>
					{item.items.map((settingItem) => (
						<AnimatedListItem
							key={settingItem.title}
							title={settingItem.title}
							description={settingItem.description}
							style={
								settingItem.title === route.params?.setting
									? pulsingStyle
									: undefined
							}
							left={(props) => (
								<MultiIcon
									{...props}
									size={20}
									type={settingItem.icon.type}
									name={settingItem.icon.name}
								/>
							)}
							right={(props) => (
								<Checkbox
									{...props}
									status={
										settings[
											settingItem.setting
												.section as SettingsSectionType
										][
											settingItem.setting
												.item as SettingsSectionItemType<SettingsSectionType>
										]
											? "checked"
											: "unchecked"
									}
								/>
							)}
							onPress={() =>
								toggleSetting(
									settingItem.setting
										.section as SettingsSectionType,
									settingItem.setting
										.item as SettingsSectionItemType<SettingsSectionType>,
								)
							}
						/>
					))}
				</List.Section>
			)}
		/>
	);
};

SettingsCheckboxes.displayName = "SettingsCheckboxes";

export default SettingsCheckboxes;
