import * as React from "react";
import { ScrollView } from "react-native";
import SettingsAppearance from "./sections/appearance";
import SettingsLayout from "./sections/layout";
import SettingsCheckboxes from "./sections/checkboxes";
import { Page } from "@/types/navigation";
import { useCurrPageEffect } from "@/hooks/useCurrPageEffect";

const CURR_PAGE: Page = "settings";

const SettingsScreen = () => {
  useCurrPageEffect(CURR_PAGE);

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
