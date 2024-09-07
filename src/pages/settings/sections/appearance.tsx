import * as React from "react";
import MultiIcon from "@/components/multiIcon";
import { useTranslations } from "@/states/persistent/translations";
import { useDialogs } from "@/states/runtime/dialogs";
import { List } from "react-native-paper";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";

const ChromaticShiftIcon = (props: { color: string; style: Style }) => (
  <MultiIcon {...props} size={20} type="material-icons" name="palette" />
);

const DuskTillDawnIcon = (props: { color: string; style: Style }) => (
  <MultiIcon
    {...props}
    size={20}
    type="material-community"
    name="theme-light-dark"
  />
);

const ChevronRightIcon = (props: { color: string; style?: Style }) => (
  <MultiIcon {...props} size={20} type="material-icons" name="chevron-right" />
);

export default function SettingsAppearance() {
  const openDialog = useDialogs((state) => state.openDialog);
  const translations = useTranslations((state) => state.translations);
  return (
    <List.Section title={translations["Appearance"]}>
      <List.Item
        title={translations["Chromatic Shift"]}
        description={translations["Change the source color of the app"]}
        left={ChromaticShiftIcon}
        right={ChevronRightIcon}
        onPress={() => openDialog("sourceColorPicker")}
      />
      <List.Item
        title={translations["Dusk till Dawn"]}
        description={translations["Change the color scheme of the app"]}
        left={DuskTillDawnIcon}
        right={ChevronRightIcon}
        onPress={() => openDialog("colorSchemePicker")}
      />
    </List.Section>
  );
}
