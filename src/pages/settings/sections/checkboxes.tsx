import * as React from "react";
import { FlatList } from "react-native";
import { Checkbox, List } from "react-native-paper";
import Animated from "react-native-reanimated";
import MultiIcon, { MultiIconType } from "@/components/multiIcon";
import { useSettings } from "@/states/persistent/settings";
import { useTranslations } from "@/states/persistent/translations";
import { usePulsing } from "@/hooks/usePulsing";
import { useRoute } from "@react-navigation/native";
import { Translation } from "@/types/translations";
import {
  BooleanSettingsSection,
  BooleanSettingsSectionItem,
} from "@/types/settings";
import { RouteProps } from "@/types/navigation";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

type PossibleText = string | Translation;

type CheckboxItem<T extends PossibleText, S extends BooleanSettingsSection> = {
  title: T;
  description: T;
  setting: {
    section: BooleanSettingsSection;
    item: BooleanSettingsSectionItem<S>;
  };
  icon: {
    name: string;
    type: MultiIconType;
  };
};

type SectionItem<T extends PossibleText, S extends BooleanSettingsSection> = {
  title: T;
  items: CheckboxItem<T, S>[];
};

type SectionItems<T extends PossibleText> = {
  [I in BooleanSettingsSection]: SectionItem<T, I>;
}[BooleanSettingsSection][];

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

const buildMultiIcon =
  (type: MultiIconType, name: string) =>
  (props: { color: string; style: Style }) => (
    <MultiIcon {...props} size={20} type={type} name={name} />
  );

const buildCheckbox =
  (checked: boolean) => (props: { color: string; style?: Style }) => (
    <Checkbox {...props} status={checked ? "checked" : "unchecked"} />
  );

const SettingsCheckboxes = () => {
  const translations = useTranslations((state) => state.translations);
  const [settings, toggleSetting] = useSettings((state) => [
    state.settings,
    state.toggleSetting,
  ]);
  const { params } = useRoute<RouteProps>();
  const { startPulsing, cancelPulsing, pulsingStyles } = usePulsing();
  const pulsingSetting = React.useMemo(
    () => (params && "setting" in params ? params.setting : undefined),
    [params]
  );

  React.useEffect(() => {
    if (pulsingSetting) {
      startPulsing();
    }
  }, [pulsingSetting, startPulsing]);

  React.useEffect(() => {
    return () => {
      cancelPulsing();
    };
  }, [cancelPulsing]);

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
      })) as SectionItem<string, BooleanSettingsSection>[],
    [translations]
  );

  return (
    <FlatList
      data={translatedSettingsData}
      keyExtractor={(item) => item.title}
      renderItem={({ item: section }) => (
        <List.Section title={section.title}>
          <FlatList
            data={section.items}
            renderItem={({ item }) => (
              <AnimatedListItem
                title={item.title}
                description={item.description}
                style={
                  item.title === pulsingSetting ? pulsingStyles : undefined
                }
                left={buildMultiIcon(item.icon.type, item.icon.name)}
                right={buildCheckbox(
                  settings[item.setting.section][item.setting.item]
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
