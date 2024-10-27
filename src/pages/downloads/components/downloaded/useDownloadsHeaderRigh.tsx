import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {ReactNativeBlobUtilStat} from 'react-native-blob-util';
import {IconButton} from 'react-native-paper';
import Share from 'react-native-share';
import FilesModule from '@/lib/files';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '@/types/navigation';
import {Logger} from '@/states/persistent/logs';

/*******************************************************************************
 *                                  COMPONENTS                                 *
 *******************************************************************************/

interface HeaderRightComponentProps {
  onShare: () => void;
  onDelete: () => void;
  onToggleSelection: () => void;
  isAllSelected: boolean;
}

const HeaderRightComponent = ({
  onShare,
  onDelete,
  onToggleSelection,
  isAllSelected,
}: HeaderRightComponentProps) => (
  <View style={styles.headerRightWrapper}>
    <IconButton icon="share" onPress={onShare} />
    <IconButton
      icon={
        isAllSelected
          ? 'checkbox-multiple-blank-outline'
          : 'checkbox-multiple-marked'
      }
      onPress={onToggleSelection}
    />
    <IconButton icon="trash-can" onPress={onDelete} />
  </View>
);

const RefreshButton = ({onPress}: {onPress: () => void}) => (
  <IconButton icon="refresh" onPress={onPress} />
);

/*******************************************************************************
 *                                     HOOK                                    *
 *******************************************************************************/

export function useDownloadsHeaderRight(
  selectedFiles: string[],
  files: Record<string, ReactNativeBlobUtilStat>,
  setSelectedFiles: React.Dispatch<React.SetStateAction<string[]>>,
  updateFiles: () => void,
): void {
  const {setOptions} = useNavigation<NavigationProps>();

  const handleShare = React.useCallback(() => {
    Share.open({
      urls: selectedFiles.map(file => `file://${files[file].path}`),
    }).catch(error => {
      Logger.error(`Error sharing files: ${error}`);
    });
  }, [selectedFiles, files]);

  const handleDelete = React.useCallback(async () => {
    try {
      await Promise.all(
        selectedFiles.map(file => FilesModule.deleteFile(files[file].path)),
      );
      updateFiles();
      setSelectedFiles([]);
    } catch (error) {
      Logger.error(`Error deleting files: ${error}`);
    }
  }, [selectedFiles, updateFiles, setSelectedFiles, files]);

  const handleToggleSelection = React.useCallback(() => {
    setSelectedFiles(prev =>
      prev.length === Object.keys(files).length ? [] : Object.keys(files),
    );
  }, [files, setSelectedFiles]);

  React.useEffect(() => {
    const isAllSelected = Object.keys(files).length === selectedFiles.length;

    setOptions({
      headerRight: () =>
        selectedFiles.length === 0 ? (
          <RefreshButton onPress={updateFiles} />
        ) : (
          <HeaderRightComponent
            onShare={handleShare}
            onDelete={handleDelete}
            onToggleSelection={handleToggleSelection}
            isAllSelected={isAllSelected}
          />
        ),
    });
  }, [
    setOptions,
    selectedFiles,
    files,
    updateFiles,
    handleShare,
    handleDelete,
    handleToggleSelection,
  ]);
}

/*******************************************************************************
 *                                    STYLES                                   *
 *******************************************************************************/
const styles = StyleSheet.create({
  headerRightWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
