import {useApp} from '@/states/fetched/app';
import * as React from 'react';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import FilesModule from '@/lib/files';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {Logger} from '@/states/persistent/logs';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function logError(subcategory: string, message: string) {
  return (error: unknown) => {
    Logger.error('New Version Dialog', subcategory, message, error);
  };
}

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

export function useDownloadAnimation() {
  const latestApp = useApp(state => state.latest);
  const [downloadProgress, setDownloadProgress] = React.useState(0);
  const downloadProgressBarHeight = useSharedValue(0);

  const showBar = React.useCallback(() => {
    downloadProgressBarHeight.value = withTiming(10, {duration: 500});
    setDownloadProgress(0);
  }, []);

  const hideBar = React.useCallback(() => {
    downloadProgressBarHeight.value = withTiming(0, {duration: 500}, () => {
      setDownloadProgress(0);
    });
  }, []);

  const handleUpdate = React.useCallback(() => {
    showBar();

    const fileName = `UpdateMe_v${latestApp.version}.apk`;
    const path = FilesModule.buildAbsolutePath(fileName);
    ReactNativeBlobUtil.fs
      .unlink(path)
      .catch(() => {})
      .finally(() => {
        FilesModule.downloadFile(
          latestApp.download,
          fileName,
          path,
          progress => {
            setDownloadProgress(progress);
          },
        )
          .then(res => {
            setDownloadProgress(1);
            FilesModule.installApk(res.path())
              .then(hideBar)
              .catch(
                logError(
                  'APK install',
                  'Failed to install the new version apk',
                ),
              );
          })
          .catch(
            logError('APK Download', 'Failed to download the new version apk'),
          );
      });
  }, [latestApp.download, latestApp.version, showBar, hideBar]);

  return {
    downloadProgress,
    downloadProgressBarHeight,
    handleUpdate,
  };
}
