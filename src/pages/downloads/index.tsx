import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Icon as RNIcon, Text} from 'react-native-paper';
import {useState} from 'react';
import {ReactNativeBlobUtilStat} from 'react-native-blob-util';
import {useDownloads, useDownloadsProps} from '@/states/temporary/downloads';
import FilesModule from '@/lib/files';
import useScreenCallback from '@/hooks/screenCallback';
import ThemedRefreshControl from '@/components/refreshControl';
import {useTheme} from '@/theme';
import Downloading from './components/downloading';
import Downloaded from './components/downloaded';

export interface DownloadsScreenChildProps extends useDownloadsProps {
  navigation: any;
  route: any;
  files: Record<string, ReactNativeBlobUtilStat>;
}

export default function DownloadsScreen({navigation, route}: any) {
  const theme = useTheme();
  const {downloads, addDownload, cancelDownload} = useDownloads();
  const [files, setFiles] = useState<Record<string, ReactNativeBlobUtilStat>>(
    {},
  );

  const updateFiles = () => {
    FilesModule.getAllFilesInfo().then(files => {
      const filteredFiles = Object.fromEntries(
        Object.entries(files).filter(
          ([file]) => !Object.keys(downloads).includes(file),
        ),
      );
      setFiles(filteredFiles);
    });
  };

  useScreenCallback({
    repeat: {callback: updateFiles, interval: 1000},
  });

  return Object.keys(downloads).length == 0 &&
    Object.keys(files).length == 0 ? (
    <View
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <RNIcon source="delete-empty" size={50} />
      <Text variant="bodyLarge">No files downloaded</Text>
    </View>
  ) : (
    <ScrollView
      refreshControl={ThemedRefreshControl(theme, {
        onRefresh: updateFiles,
        refreshing: false,
      })}>
      <Downloading
        navigation={navigation}
        route={route}
        downloads={downloads}
        files={files}
        addDownload={addDownload}
        cancelDownload={cancelDownload}
      />
      <Downloaded
        navigation={navigation}
        route={route}
        downloads={downloads}
        files={files}
        addDownload={addDownload}
        cancelDownload={cancelDownload}
        updateFiles={updateFiles}
      />
    </ScrollView>
  );
}
