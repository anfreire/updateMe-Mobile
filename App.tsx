import React, { useEffect, useMemo } from "react";
import {
  SafeAreaView,
  StatusBar,
  StatusBarStyle,
  StyleSheet,
  View,
} from "react-native";
import FilesModule from "@/lib/files";
import { useTheme } from "@/theme";
import DrawerWrapper from "@/global/drawer";
import { useSettings } from "@/states/persistent/settings";
import { useDialogs } from "@/states/temporary/dialogs";
import { useApp } from "@/states/temporary/app";
import { useTips } from "@/states/temporary/tips";
import PermissionsModule from "@/lib/permissions";
import BackgroundTasksModule from "@/lib/backgroundTasks";
import { useToken } from "@/states/persistent/token";
import MainStack from "@/navigation";

function App(): React.JSX.Element {
  const theme = useTheme();
  const deleteOnLeave = useSettings(
    (state) => state.settings.downloads.deleteOnLeave
  );
  const openDialog = useDialogs().openDialog;
  const fetchTips = useTips().fetchTips;
  const initToken = useToken().init;
  const [info, localVersion] = useApp((state) => [
    state.info,
    state.localVersion,
  ]);
  const [releaseNotification, updateNotification] = useSettings((state) => [
    state.settings.notifications.newReleaseNotification,
    state.settings.notifications.updatesNotification,
  ]);

  useEffect(() => {
    if (localVersion && info.version && info.version > localVersion)
      openDialog("newVersion");
  }, [info, localVersion, openDialog]);

  useEffect(() => {
    if (releaseNotification || updateNotification) {
      PermissionsModule.grantPostNotification().then((_) =>
        BackgroundTasksModule.initBackgroundTasks()
      );
    }
  }, [releaseNotification, updateNotification]);

  useEffect(() => {
    initToken(); // Check if the user token exists, if not, it will be initialized
    fetchTips(); // Fetch tips from the server

    if (deleteOnLeave) FilesModule.deleteAllFiles(); // Clean up files on app enter (In case it didn't clean up on exit)

    return () => {
      if (deleteOnLeave) FilesModule.deleteAllFiles(); // Clean up files on app exit
    };
  }, []); // It must run only at the start and end of the app

  const statusBarProps: {
    backgroundColor: string;
    barStyle: StatusBarStyle;
  } = useMemo(
    () => ({
      backgroundColor: theme.schemedTheme.surfaceContainer,
      barStyle: theme.colorScheme === "dark" ? "light-content" : "dark-content",
    }),
    [theme.schemedTheme, theme.colorScheme]
  );

  return (
    <>
      <StatusBar {...statusBarProps} />
      <SafeAreaView>
        <View style={styles.appWrapper}>
          <DrawerWrapper>
            <MainStack />
          </DrawerWrapper>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  appWrapper: {
    width: "100%",
    height: "100%",
  },
});

export default App;
