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
import {Logger} from '@/states/persistent/logs';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const deleteOnLeave = () => {
  if (useSettings.getState().settings.downloads.deleteOnLeave) {
    FilesModule.deleteAllFiles().then(filesCount => {
      const message = filesCount
        ? `Deleted ${filesCount} files`
        : 'No files to delete';
      Logger.info('Settings', 'Delete on Leave', message);
    });
  }
};

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useAppComponent() {
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

  return {statusBarProps};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

function App(): React.JSX.Element {
  const {statusBarProps} = useAppComponent();

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

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  appWrapper: {
    width: '100%',
    height: '100%',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default App;
