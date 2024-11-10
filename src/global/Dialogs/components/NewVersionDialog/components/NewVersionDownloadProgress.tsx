import * as React from 'react';
import {StyleSheet} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {useApp} from '@/states/fetched/app';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import FilesModule from '@/lib/files';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {Logger} from '@/states/persistent/logs';
import {useTheme} from '@/theme';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const ANIMATION_DURATION = 500;
const CLOSED_PROGRESS_BAR_HEIHGT = 0;
const OPEN_PROGRESS_BAR_HEIHGT = 10;

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

const useNewVersionDownloadProgress = (
  setHandleUpdate: React.Dispatch<React.SetStateAction<() => void>>,
) => {
  const {schemedTheme} = useTheme();
  const latestApp = useApp(state => state.latest);
  const [downloadProgress, setDownloadProgress] = React.useState(0);
  const downloadProgressBarHeight = useSharedValue(0);

  const showBar = React.useCallback(() => {
    downloadProgressBarHeight.value = withTiming(OPEN_PROGRESS_BAR_HEIHGT, {
      duration: ANIMATION_DURATION,
    });
    setDownloadProgress(0);
  }, []);

  const hideBar = React.useCallback(() => {
    downloadProgressBarHeight.value = withTiming(
      CLOSED_PROGRESS_BAR_HEIHGT,
      {duration: ANIMATION_DURATION},
      () => {
        setDownloadProgress(0);
      },
    );
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

  const progressBarStyle = useAnimatedStyle(() => ({
    width: 300,
    marginBottom: -25,
    height: downloadProgressBarHeight.value,
    overflow: 'hidden',
  }));

  React.useEffect(() => {
    setHandleUpdate(() => handleUpdate);
  }, [handleUpdate, setHandleUpdate]);

  return {
    downloadProgress,
    progressBarStyle,
    handleUpdate,
    progressBarColor: schemedTheme.primary,
  };
};

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface NewVersionDownloadProgressProps {
  setHandleUpdate: React.Dispatch<React.SetStateAction<() => void>>;
}

const NewVersionDownloadProgress = ({
  setHandleUpdate,
}: NewVersionDownloadProgressProps) => {
  const {downloadProgress, progressBarStyle, progressBarColor} =
    useNewVersionDownloadProgress(setHandleUpdate);

  return (
    <Animated.View style={progressBarStyle}>
      <ProgressBar
        animatedValue={downloadProgress}
        color={progressBarColor}
        style={styles.progressBar}
      />
    </Animated.View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(NewVersionDownloadProgress);
