import {interpolate, useTranslations} from '@/states/persistent/translations';
import {useDialogs} from '@/states/runtime/dialogs';
import {useDownloads} from '@/states/runtime/downloads';
import {useTheme} from '@/theme';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {IconButton, List, Text, TouchableRipple} from 'react-native-paper';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function buildLeftComponent(props: {color: string; style: Style}) {
  return (
    <TouchableRipple style={[styles.cancelButton, props.style]}>
      <IconButton icon="cancel" size={25} />
    </TouchableRipple>
  );
}

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useDownloadingItem(download: string, progress: number) {
  const translations = useTranslations(state => state.translations);
  const {schemedTheme} = useTheme();
  const openDialog = useDialogs(state => state.openDialog);
  const cancelDownload = useDownloads(state => state.cancelDownload);

  const buildRightComponent = React.useCallback(() => {
    return (
      <View style={styles.progressContainer}>
        <Text style={[styles.progressText, {color: schemedTheme.secondary}]}>
          {`${(progress * 100).toFixed(0)}%`}
        </Text>
      </View>
    );
  }, [progress, schemedTheme.secondary]);

  const handleOnPress = React.useCallback(() => {
    openDialog({
      title: translations['Cancel download'],
      content: interpolate(
        translations['Are you sure you want to cancel the download of $1?'],
        download,
      ),
      actions: [
        {
          title: translations['Keep downloading'],
          action: () => {},
        },
        {
          title: translations['Cancel'],
          action: () => cancelDownload(download),
        },
      ],
    });
  }, [translations, download]);

  return {buildRightComponent, handleOnPress};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface DownloadingItemProps {
  download: string;
  progress: number;
}

const DownloadingItem = ({download, progress}: DownloadingItemProps) => {
  const {buildRightComponent, handleOnPress} = useDownloadingItem(
    download,
    progress,
  );

  return (
    <List.Item
      style={styles.wrapper}
      onPress={handleOnPress}
      title={download}
      left={buildLeftComponent}
      right={buildRightComponent}
      titleNumberOfLines={1}
    />
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  wrapper: {
    paddingRight: 0,
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
    width: 100,
    minHeight: 40,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    position: 'relative',
    width: 20,
    height: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default DownloadingItem;
