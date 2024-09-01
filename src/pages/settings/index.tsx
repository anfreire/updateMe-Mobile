import * as React from "react";
import { ScrollView } from "react-native";
import SettingsAppearance from "./sections/appearance";
import SettingsLayout from "./sections/layout";
import SettingsCheckboxes from "./sections/checkboxes";

const SettingsScreen = () => {
  return (
    <ScrollView>
      <SettingsAppearance />
      <SettingsLayout />
      <SettingsCheckboxes />
    </ScrollView>
  );
};

SettingsScreen.displayName = "SettingsScreen";

export default SettingsScreen;
