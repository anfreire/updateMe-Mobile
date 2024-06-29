import {useEffect, useState} from 'react';
import {Checkbox, IconButton, List} from 'react-native-paper';
import {View} from 'react-native';
import Share from 'react-native-share';
import {DownloadsScreenChildProps} from '..';
import {useTheme} from '@/theme';
import FilesModule from '@/lib/files';
import MultiIcon from '@/components/multiIcon';

export default function Downloaded(
  props: DownloadsScreenChildProps & {updateFiles: () => void},
) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const theme = useTheme();

  const deleteSelectedFiles = () => {
    setSelectedFiles(prev => {
      Promise.all(prev.map(file => FilesModule.deleteFile(file))).then(() => {
        props.updateFiles();
        setSelectedFiles([]);
      });
      return [];
    });
  };

  const updateHeader = (newSelectedFiles: string[]) => {
    const allFilesSelected =
      newSelectedFiles.length === Object.keys(props.files).length;
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          {newSelectedFiles.length == 0 ? (
            <>
              <IconButton icon="refresh" onPress={props.updateFiles} />
            </>
          ) : (
            <>
              <IconButton
                icon="share"
                onPress={() => {
                  Share.open({
                    ...(newSelectedFiles.length === 1
                      ? {
                          url: 'file://' + props.files[newSelectedFiles[0]].path,
                        }
                      : {
                          urls: newSelectedFiles.map(
                            file => 'file://' + props.files[file].path,
                          ),
                        }),
                  }).catch(_ => {});
                }}
              />
              <IconButton
                icon={
                  allFilesSelected
                    ? 'checkbox-multiple-blank-outline'
                    : 'checkbox-multiple-marked'
                }
                onPress={() =>
                  setSelectedFiles(_ =>
                    allFilesSelected ? [] : Object.keys(props.files),
                  )
                }
              />
              <IconButton icon="trash-can" onPress={deleteSelectedFiles} />
            </>
          )}
        </View>
      ),
    });
  };

  const selectFile = (file: string) => {
    setSelectedFiles(prev => {
      const newPrev = prev.includes(file)
        ? prev.filter(f => f !== file)
        : [...prev, file];
      return newPrev;
    });
  };

  useEffect(() => {
    updateHeader(selectedFiles);
  }, [selectedFiles]);

  return true ? (
    <List.Section title="Downloaded">
      {Object.keys(props.files).map((file, i) => (
        <List.Item
          android_ripple={null}
          onPress={() => {
            selectedFiles.length === 0
              ? FilesModule.installApk(file)
              : selectFile(file);
          }}
          onLongPress={() => selectFile(file)}
          key={i}
          title={file}
          style={{
            backgroundColor: selectedFiles.includes(file)
              ? theme.schemedTheme.surfaceBright
              : theme.schemedTheme.surface,
          }}
          description={`${(props.files[file].size / 1024 / 1024).toFixed(2)} MB`}
          left={props => (
            <MultiIcon
              {...props}
              size={25}
              type="font-awesome"
              name="android"
            />
          )}
          right={props =>
            selectedFiles.length > 0 && (
              <Checkbox
                {...props}
                status={selectedFiles.includes(file) ? 'checked' : 'unchecked'}
              />
            )
          }></List.Item>
      ))}
    </List.Section>
  ) : (
    <></>
  );
}
