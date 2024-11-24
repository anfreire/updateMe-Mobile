import * as React from 'react';
import {Image, StyleSheet, useWindowDimensions} from 'react-native';
import {Button, Dialog} from 'react-native-paper';
import {Share} from 'react-native';
import {useDialogs} from '@/states/runtime/dialogs';
import {useTranslations} from '@/states/persistent/translations';
import {useApp} from '@/states/fetched/app';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/
const IMAGE_SIZE_RATIO = 0.6;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const QRCODE_RELEASES = require('@assets/QRCODE.png');

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function getImageSize(windowWidth: number, windowHeight: number) {
  const size = Math.min(windowWidth, windowHeight) * IMAGE_SIZE_RATIO;
  return {width: size, height: size};
}

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useShareDialog() {
  const latestAppInfo = useApp(state => state.latest);
  const translations = useTranslations(state => state.translations);
  const closeDialog = useDialogs(state => state.closeDialog);
  const {width, height} = useWindowDimensions();

  const labels = React.useMemo(
    () => ({
      title: translations['Share'],
      done: translations['Done'],
      share: translations['Share the download link'],
    }),
    [translations],
  );

  const imageSize = React.useMemo(
    () => getImageSize(width, height),
    [width, height],
  );

  const handleShare = React.useCallback(() => {
    closeDialog();
    Share.share(
      {
        message: latestAppInfo.download,
        title: translations['UpdateMe Download Link'],
      },
      {dialogTitle: translations['UpdateMe Download Link']},
    );
  }, [latestAppInfo.download, translations]);

  return {
    closeDialog,
    labels,
    imageSize,
    handleShare,
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const ShareDialog = () => {
  const {closeDialog, labels, imageSize, handleShare} = useShareDialog();

  return (
    <Dialog visible onDismiss={closeDialog} style={styles.dialog}>
      <Dialog.Title>{labels.title}</Dialog.Title>
      <Dialog.Content style={styles.content}>
        <Image
          source={QRCODE_RELEASES}
          resizeMode="contain"
          style={imageSize}
        />
        <Button mode="contained-tonal" onPress={handleShare}>
          {labels.share}
        </Button>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={closeDialog}>{labels.done}</Button>
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
    justifyContent: 'center',
    display: 'flex',
    marginVertical: 20,
    gap: 20,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(ShareDialog);
