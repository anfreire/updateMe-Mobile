import * as React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Checkbox, IconButton, List} from 'react-native-paper';
import Share from 'react-native-share';
import {useTheme} from '@/theme';
import FilesModule from '@/lib/files';
import MultiIcon from '@/components/MultiIcon';
import {ReactNativeBlobUtilStat} from 'react-native-blob-util';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '@/types/navigation';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';

function renderKeyExtractor(item: [string, ReactNativeBlobUtilStat]) {
  return item[0];
}

const getHeaderRight = (
  selectedFiles: string[],
  files: Record<string, ReactNativeBlobUtilStat>,
  setSelectedFiles: React.Dispatch<React.SetStateAction<string[]>>,
  updateFiles: () => void,
) => {
  if (selectedFiles.length === 0) {
    return () => <IconButton icon="refresh" onPress={updateFiles} />;
  }

  const handleShare = () =>
    Share.open({
      urls: selectedFiles.map(file => 'file://' + files[file].path),
    }).catch(() => {});

  const handleDelete = () =>
    Promise.all(selectedFiles.map(file => FilesModule.deleteFile(file)))
      .then(updateFiles)
      .then(() => setSelectedFiles([]));

  return () => (
    <View style={styles.headerRightWrapper}>
      <IconButton icon="share" onPress={handleShare} />
      <IconButton
        icon={
          Object.keys(files).length === selectedFiles.length
            ? 'checkbox-multiple-blank-outline'
            : 'checkbox-multiple-marked'
        }
        onPress={() =>
          setSelectedFiles(prev =>
            prev.length === Object.keys(files).length ? [] : Object.keys(files),
          )
        }
      />
      <IconButton icon="trash-can" onPress={handleDelete} />
    </View>
  );
};

const AndroidIcon = (props: {color: string; style: Style}) => (
  <MultiIcon {...props} size={25} type="font-awesome" name="android" />
);

const getRightCheckbox = (selectedFiles: string[], file: string) =>
  !selectedFiles.length
    ? undefined
    : (props: {color: string; style?: Style}) => (
        <Checkbox
          {...props}
          status={selectedFiles.includes(file) ? 'checked' : 'unchecked'}
        />
      );

const Downloaded = ({
  files,
  updateFiles,
}: {
  files: Record<string, ReactNativeBlobUtilStat>;
  updateFiles: () => void;
}) => {
  const {setOptions} = useNavigation<NavigationProps>();
  const theme = useTheme();
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);

  const selectFile = React.useCallback((file: string) => {
    setSelectedFiles(prev =>
      prev.includes(file) ? prev.filter(f => f !== file) : [...prev, file],
    );
  }, []);

  React.useEffect(() => {
    setOptions({
      headerRight: getHeaderRight(
        selectedFiles,
        files,
        setSelectedFiles,
        updateFiles,
      ),
    });
  }, [setOptions, selectedFiles, files, updateFiles]);

  if (Object.keys(files).length === 0) {
    return null;
  }

  return (
    <List.Section title="Downloaded">
      <FlatList
        data={Object.entries(files)}
        renderItem={({item: [file, fileStats]}) => (
          <List.Item
            title={file}
            description={`${(fileStats.size / 1024 / 1024).toFixed(2)} MB`}
            onPress={() => {
              if (selectedFiles.length === 0) FilesModule.installApk(file);
              else selectFile(file);
            }}
            onLongPress={() => selectFile(file)}
            style={{
              backgroundColor: selectedFiles.includes(file)
                ? theme.schemedTheme.surfaceBright
                : theme.schemedTheme.surface,
            }}
            left={AndroidIcon}
            right={getRightCheckbox(selectedFiles, file)}
          />
        )}
        keyExtractor={renderKeyExtractor}
      />
    </List.Section>
  );
};

Downloaded.displayName = 'Downloaded';

export default React.memo(Downloaded);

const styles = StyleSheet.create({
  headerRightWrapper: {flexDirection: 'row'},
});
