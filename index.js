import * as React from "react";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import "react-native-gesture-handler";
import { ThemeProvider } from "@/theme";
import BackgroundFetch from "react-native-background-fetch";
import { Toast } from "@/global/toast";
import { Dialogs } from "@/global/dialogs";
import { StatesBridgeManager } from "@/states/bridge";
import BackgroundTasksModule from "@/lib/backgroundTasks";

BackgroundFetch.registerHeadlessTask(BackgroundTasksModule.headlessTask);
function Root() {
  return (
    <ThemeProvider>
      <Toast />
      <Dialogs />
      <App />
      <StatesBridgeManager />
    </ThemeProvider>
  );
}

AppRegistry.registerComponent(appName, () => Root);
