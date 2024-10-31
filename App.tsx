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
import PermissionsModule from '@/lib/permissions';
import BackgroundTasksModule from '@/lib/backgroundTasks';
import MainStack from '@/navigation';
import {useApp} from '@/states/fetched/app';

const deleteOnLeave = () => {
  if (useSettings.getState().settings.downloads.deleteOnLeave) {
    console.log('Deleting all files');
    FilesModule.deleteAllFiles();
  }
};

function App(): React.JSX.Element {
  const theme = useTheme();

  const openDialog = useDialogs(state => state.openDialog);
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
    deleteOnLeave();

    return deleteOnLeave;
  }, []);

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
