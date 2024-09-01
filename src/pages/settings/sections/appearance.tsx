import * as React from "react";
import MultiIcon from "@/components/multiIcon";
import { useTranslations } from "@/states/persistent/translations";
import { useDialogs } from "@/states/runtime/dialogs";
import { List } from "react-native-paper";

export default function SettingsAppearance() {
  const openDialog = useDialogs((state) => state.openDialog);
  const translations = useTranslations((state) => state.translations);
  return (
    <List.Section title={translations["Appearance"]}>
      <List.Item
        title={translations["Chromatic Shift"]}
        description={translations["Change the source color of the app"]}
        left={(props) => (
          <MultiIcon
            {...props}
            size={20}
            type="material-icons"
            name="palette"
          />
        )}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => openDialog("sourceColorPicker")}
      />
      <List.Item
        title={translations["Dusk till Dawn"]}
        description={translations["Change the color scheme of the app"]}
        left={(props) => (
          <MultiIcon
            {...props}
            size={20}
            type="material-community"
            name="theme-light-dark"
          />
        )}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => openDialog("colorSchemePicker")}
      />
    </List.Section>
  );
}
