import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {Button, Dialog} from 'react-native-paper';
import {Share} from 'react-native';
import {useDialogs} from '@/stores/runtime/dialogs';
import {APP_RELEASES_URL, APP_TITLE} from '@/../data';
import FastImage from 'react-native-fast-image';
import {interpolate, useTranslations} from '@/stores/persistent/translations';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/
const IMAGE_SIZE_RATIO = 0.6;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const QRCODE_RELEASES = require('@assets/QRCODE.png');

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function getImageSize(windowWidth: number, windowHeight: number) {
  const size = Math.min(windowWidth, windowHeight) * IMAGE_SIZE_RATIO;
  return {width: size, height: size};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const ShareDialog = () => {
  const translations = useTranslations(state => state.translations);
  const {width, height} = useWindowDimensions();
  const closeDialog = useDialogs(state => state.closeDialog);

  const labels = useMemo(
    () => ({
      title: translations['Share'],
      done: translations['Done'],
      share: translations['Share the download link'],
    }),
    [translations],
  );

  const imageSize = useMemo(() => getImageSize(width, height), [width, height]);

  const handleShare = useCallback(() => {
    closeDialog();
    const title = interpolate(translations['$1 download link'], APP_TITLE);
    Share.share(
      {
        message: APP_RELEASES_URL,
        title,
      },
      {dialogTitle: title},
    );
  }, [translations]);

  return (
    <Dialog visible onDismiss={closeDialog}>
      <Dialog.Title>{labels.title}</Dialog.Title>
      <Dialog.Content style={styles.dialogContent}>
        <FastImage
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
  dialogContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    gap: 20,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(ShareDialog);
