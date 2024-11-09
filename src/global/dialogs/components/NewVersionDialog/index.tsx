import * as React from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {Button, Dialog, ProgressBar} from 'react-native-paper';
import {useDialogs} from '@/states/runtime/dialogs';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {useTheme} from '@/theme';
import {interpolate, useTranslations} from '@/states/persistent/translations';
import {useApp} from '@/states/fetched/app';
import NewVersionFeature from './NewVersionFeature';
import {useDownloadAnimation} from './useDownloadAnimation';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useNewVersionDialog() {
  const activeDialog = useDialogs(state => state.activeDialog);
  const latestApp = useApp(state => state.latest);
  const translations = useTranslations(state => state.translations);
  const {schemedTheme} = useTheme();
  const {downloadProgress, downloadProgressBarHeight, handleUpdate} =
    useDownloadAnimation();

  const handleManualUpdate = React.useCallback(() => {
    Linking.openURL(latestApp.download);
  }, [latestApp.download]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: 300,
    marginBottom: -25,
    height: downloadProgressBarHeight.value,
    overflow: 'hidden',
  }));

  const labels = React.useMemo(
    () => ({
      downloadManually: translations['Download manually'],
      update: translations['Update'],
      title: interpolate(
        translations['Update Me v$1 is available!'],
        latestApp.version,
      ),
    }),
    [translations, latestApp.version],
  );

  return {
    activeDialog,
    latestApp,
    labels,
    schemedTheme,
    downloadProgress,
    downloadProgressBarHeight,
    handleUpdate,
    handleManualUpdate,
    progressBarStyle,
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const NewVersionDialog = () => {
  const {
    activeDialog,
    latestApp,
    labels,
    schemedTheme,
    downloadProgress,
    handleUpdate,
    handleManualUpdate,
    progressBarStyle,
  } = useNewVersionDialog();

  if (activeDialog !== 'newVersion') return null;

  return (
    <Dialog
      visible
      dismissable={false}
      dismissableBackButton={false}
      onDismiss={() => {}}
      style={styles.dialog}>
      <Dialog.Title>{labels.title}</Dialog.Title>
      <Dialog.Content style={styles.content}>
        <View style={styles.carouselContainer}>
          <Carousel
            width={300}
            height={100}
            loop
            autoPlay={true}
            autoPlayInterval={4000}
            data={latestApp.releaseNotes}
            renderItem={NewVersionFeature}
          />
          <Animated.View style={progressBarStyle}>
            <ProgressBar
              animatedValue={downloadProgress}
              color={schemedTheme.primary}
              style={styles.progressBar}
            />
          </Animated.View>
        </View>
      </Dialog.Content>
      <Dialog.Actions style={styles.actions}>
        <Button onPress={handleManualUpdate}>{labels.downloadManually}</Button>
        <Button onPress={handleUpdate}>{labels.update}</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  dialog: {
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    marginTop: 20,
    marginBottom: 20,
    gap: 20,
  },
  carouselContainer: {
    width: 300,
    height: 100,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    display: 'flex',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(NewVersionDialog);
