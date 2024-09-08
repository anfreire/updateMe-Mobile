import * as React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StatusBarStyle,
  StyleSheet,
  View,
} from 'react-native';
import FilesModule from '@/lib/files';
import {useTheme} from '@/theme';
import DrawerWrapper from '@/global/drawer';
import {useSettings} from '@/states/persistent/settings';
import {useDialogs} from '@/states/runtime/dialogs';
import {useTips} from '@/states/fetched/tips';
import PermissionsModule from '@/lib/permissions';
import BackgroundTasksModule from '@/lib/backgroundTasks';
import MainStack from '@/navigation';
import {useApp} from '@/states/fetched/app';

function App(): React.JSX.Element {
  const theme = useTheme();
  const deleteOnLeave = useSettings(
    state => state.settings.downloads.deleteOnLeave,
  );
  const openDialog = useDialogs(state => state.openDialog);
  const fetchTips = useTips(state => state.fetch);
  const [info, localVersion] = useApp(state => [
    state.latest,
    state.localVersion,
  ]);
  const [releaseNotification, updateNotification] = useSettings(state => [
    state.settings.notifications.newReleaseNotification,
    state.settings.notifications.updatesNotification,
  ]);

  React.useEffect(() => {
    if (localVersion && info.version && info.version > localVersion)
      openDialog('newVersion');
  }, [info, localVersion]);

  React.useEffect(() => {
    if (releaseNotification || updateNotification) {
      PermissionsModule.grantPostNotification().then(_ =>
        BackgroundTasksModule.initBackgroundTasks(),
      );
    }
  }, [releaseNotification, updateNotification]);

  React.useEffect(() => {
    fetchTips(); // Fetch tips from the server

    if (deleteOnLeave)
      return () => {
        FilesModule.deleteAllFiles();
      }; // Clean up files on app enter (In case it didn't clean up on exit)
  }, [deleteOnLeave]);

  const statusBarProps: {
    backgroundColor: string;
    barStyle: StatusBarStyle;
  } = React.useMemo(
    () => ({
      backgroundColor: theme.schemedTheme.surfaceContainer,
      barStyle: theme.colorScheme === 'dark' ? 'light-content' : 'dark-content',
    }),
    [theme.schemedTheme, theme.colorScheme],
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
    width: '100%',
    height: '100%',
  },
});

export default App;
