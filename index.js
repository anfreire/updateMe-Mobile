/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import "react-native-gesture-handler";
import { ThemeProvider } from "@/theme";
import { ToastWrapper } from "@/global/toast";
import { DialogsWrapper } from "@/global/dialogs";
import BackgroundFetch from "react-native-background-fetch";
import { headlessTask } from "@/lib/background";
import { ComputedProvider } from "@/providers/computed";

BackgroundFetch.registerHeadlessTask(headlessTask);
function Root() {
	return (
		<ThemeProvider>
			<ComputedProvider>
				<ToastWrapper>
					<DialogsWrapper>
						<App />
					</DialogsWrapper>
				</ToastWrapper>
			</ComputedProvider>
		</ThemeProvider>
	);
}

AppRegistry.registerComponent(appName, () => Root);
