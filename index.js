/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import "react-native-gesture-handler";
import { ThemeProvider } from "@/theme";
import BackgroundFetch from "react-native-background-fetch";
import { headlessTask } from "@/lib/background";
import { Toast } from "@/global/toast";
import { Dialogs } from "@/global/dialogs";

BackgroundFetch.registerHeadlessTask(headlessTask);
function Root() {
	return (
		<ThemeProvider>
			<Toast />
			<Dialogs />
			<App />
		</ThemeProvider>
	);
}

AppRegistry.registerComponent(appName, () => Root);
