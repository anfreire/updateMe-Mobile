import * as React from "react";
import { FlatList, ListRenderItem } from "react-native";
import { Checkbox, List } from "react-native-paper";
import Animated from "react-native-reanimated";
import MultiIcon, { MultiIconType } from "@/components/multiIcon";
import {
  SettingsSectionType,
  SettingsSectionItemType,
  useSettings,
} from "@/states/persistent/settings";
import { Translation, useTranslations } from "@/states/persistent/translations";
import { usePulsing } from "@/hooks/usePulsing";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AppsStackParams } from "@/navigation/apps";
import { MainStackParams } from "@/navigation";
import { TipsStackParams } from "@/navigation/tips";

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

type PossibleText = string | Translation;

type CheckboxItem<T extends PossibleText, S extends SettingsSectionType> = {
  title: T;
  description: T;
  setting: {
    section: SettingsSectionType;
    item: SettingsSectionItemType<S>;
  };
  icon: {
    name: string;
    type: MultiIconType;
  };
};

type SectionItem<T extends PossibleText, S extends SettingsSectionType> = {
  title: T;
  items: CheckboxItem<T, S>[];
};

type SectionItems<T extends PossibleText> = {
  [I in SettingsSectionType]: SectionItem<T, I>;
}[SettingsSectionType][];

const SettingsData: SectionItems<Translation> = [
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
  },
  {
    title: "Notifications",
    items: [
      {
        title: "Update Junkie",
        description: "Get notified when there are installed apps updates",
        setting: {
          section: "notifications",
          item: "updatesNotification",
        },
        icon: { name: "update", type: "material-icons" },
      },
      {
        title: "Frontline Fan",
        description: "Get notified when there is a new UpdateMe release",
        setting: {
          section: "notifications",
          item: "newReleaseNotification",
        },
        icon: { name: "new-releases", type: "material-icons" },
      },
    ],
  },
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
  },
];

const SettingsCheckboxes = () => {
  const translations = useTranslations((state) => state.translations);
  const [settings, toggleSetting] = useSettings((state) => [
    state.settings,
    state.toggleSetting,
  ]);
  const route =
    useRoute<RouteProp<AppsStackParams & MainStackParams & TipsStackParams>>();
  const pulsingStyle = usePulsing(!!route.params?.setting);

  const translatedSettingsData = React.useMemo(
    () =>
      SettingsData.map((group) => ({
        ...group,
        title: translations[group.title],
        items: group.items.map((item) => ({
          ...item,
          title: translations[item.title],
          description: translations[item.description],
        })),
      })) as SectionItem<string, SettingsSectionType>[],
    [translations]
  );

  return (
    <FlatList
      data={translatedSettingsData}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        <List.Section title={item.title}>
          <FlatList
            data={item.items}
            renderItem={({ item }) => (
              <AnimatedListItem
                title={item.title}
                description={item.description}
                style={
                  item.title === route.params?.setting
                    ? pulsingStyle
                    : undefined
                }
                left={(props) => (
                  <MultiIcon
                    {...props}
                    size={20}
                    type={item.icon.type}
                    name={item.icon.name}
                  />
                )}
                right={(props) => (
                  <Checkbox
                    {...props}
                    status={
                      settings[item.setting.section][item.setting.item]
                        ? "checked"
                        : "unchecked"
                    }
                  />
                )}
                onPress={() =>
                  toggleSetting(item.setting.section, item.setting.item)
                }
              />
            )}
          />
        </List.Section>
      )}
    />
  );
};

SettingsCheckboxes.displayName = "SettingsCheckboxes";

export default SettingsCheckboxes;
