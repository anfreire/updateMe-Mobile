import * as React from "react";
import { ScrollView } from "react-native";
import SettingsAppearance from "./sections/appearance";
import SettingsLayout from "./sections/layout";
import SettingsCheckboxes from "./sections/checkboxes";

export default function SettingsScreen() {
	return (
		<ScrollView>
			<SettingsAppearance />
			<SettingsLayout />
			<SettingsCheckboxes  />
		</ScrollView>
	);
}
