import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Icon, Text} from 'react-native-paper';
import {ReactNativeBlobUtilStat} from 'react-native-blob-util';
import {useFocusEffect} from '@react-navigation/native';
import FilesModule from '@/lib/files';
import {useRefreshControlBuilder} from '@/hooks/useRefreshControlBuilder';
import Downloading from './components/downloading';
import Downloaded from './components/downloaded';
import {useDownloads} from '@/states/runtime/downloads';
import {useTranslations} from '@/states/persistent/translations';
import {Page} from '@/types/navigation';
import {useCurrPageEffect} from '@/hooks/useCurrPageEffect';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'downloads';
const REFRESH_INTERVAL = 1000;

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useDownloadsScreen() {
  const downloads = useDownloads(state => state.downloads);
  const [files, setFiles] = React.useState<
    Record<string, ReactNativeBlobUtilStat>
  >({});
  const translations = useTranslations(state => state.translations);

  const updateFiles = React.useCallback(() => {
    FilesModule.getAllFilesInfo().then(setFiles);
  }, []);

  const downloadedFiles = Object.fromEntries(
    Object.entries(files).filter(([key, _]) => {
      return !downloads[key];
    }),
  );

  useFocusEffect(
    React.useCallback(() => {
      const interval = setInterval(updateFiles, REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }, [updateFiles]),
  );

  useCurrPageEffect(CURR_PAGE);

  const refreshControl = useRefreshControlBuilder(updateFiles);

  return {
    downloads,
    files,
    downloadedFiles,
    translations,
    updateFiles,
    refreshControl,
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const DownloadsScreen = () => {
  const {
    downloads,
    downloadedFiles,
    translations,
    updateFiles,
    refreshControl,
  } = useDownloadsScreen();

  if (!Object.keys(downloads).length && !Object.keys(downloadedFiles).length) {
    return (
      <View style={styles.emptyContainer}>
        <Icon source="delete-empty" size={50} />
        <Text variant="bodyLarge">{translations['No files downloaded']}</Text>
      </View>
    );
  }

  return (
    <ScrollView refreshControl={refreshControl}>
      <Downloading downloads={downloads} />
      <Downloaded files={downloadedFiles} updateFiles={updateFiles} />
    </ScrollView>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  emptyContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default DownloadsScreen;
