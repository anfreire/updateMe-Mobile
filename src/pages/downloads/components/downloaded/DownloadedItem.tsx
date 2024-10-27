import MultiIcon from '@/components/MultiIcon';
import * as React from 'react';
import {ReactNativeBlobUtilStat} from 'react-native-blob-util';
import {Checkbox, List} from 'react-native-paper';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import FilesModule from '@/lib/files';
import {useTheme} from '@/theme';

/*******************************************************************************
 *                                  CONSTANTS                                  *
 *******************************************************************************/
const ONE_KB = 1024;
const ONE_MB = 1024 * ONE_KB;
const ONE_GB = 1024 * ONE_MB;

/*******************************************************************************
 *                                    UTILS                                    *
 *******************************************************************************/

function buildAndroidIcon(props: {color: string; style: Style}) {
  return <MultiIcon {...props} size={25} type="font-awesome" name="android" />;
}

/*******************************************************************************
 *                                     HOOK                                    *
 *******************************************************************************/

function useDownloadedItem(
  selectedFiles: string[],
  file: string,
  fileStats: ReactNativeBlobUtilStat,
  selectFile: (file: string) => void,
) {
  const {schemedTheme} = useTheme();

  const buildRightCheckbox = React.useCallback(
    (props: {color: string; style?: Style}) => {
      if (!selectedFiles.length) return undefined;

      return (
        <Checkbox
          {...props}
          status={selectedFiles.includes(file) ? 'checked' : 'unchecked'}
        />
      );
    },
    [selectedFiles, file],
  );

  const handleOnPress = React.useCallback(() => {
    if (selectedFiles.length === 0) FilesModule.installApk(fileStats.path);
    else selectFile(file);
  }, [selectedFiles, file, fileStats, selectFile]);

  const handleOnLongPress = React.useCallback(
    () => selectFile(file),
    [selectFile, file],
  );

  const dynamicStyles = React.useMemo(
    () => ({
      backgroundColor: selectedFiles.includes(file)
        ? schemedTheme.surfaceBright
        : schemedTheme.surface,
    }),
    [selectedFiles, file, schemedTheme],
  );

  const description = React.useMemo(() => {
    if (fileStats.size < ONE_MB)
      return `${(fileStats.size / ONE_KB).toFixed(2)} KB`;
    if (fileStats.size < ONE_GB)
      return `${(fileStats.size / ONE_MB).toFixed(2)} MB`;
    return `${(fileStats.size / ONE_GB).toFixed(2)} GB`;
  }, [fileStats.size]);

  return {
    buildRightCheckbox,
    handleOnPress,
    handleOnLongPress,
    dynamicStyles,
    description,
  };
}

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

interface DownloadedItemProps {
  selectedFiles: string[];
  file: string;
  fileStats: ReactNativeBlobUtilStat;
  selectFile: (file: string) => void;
}

const DownloadedItem = ({
  selectedFiles,
  file,
  fileStats,
  selectFile,
}: DownloadedItemProps) => {
  const {
    buildRightCheckbox,
    handleOnPress,
    handleOnLongPress,
    dynamicStyles,
    description,
  } = useDownloadedItem(selectedFiles, file, fileStats, selectFile);

  if (!fileStats) {
    return null;
  }

  return (
    <List.Item
      title={file}
      description={description}
      onPress={handleOnPress}
      onLongPress={handleOnLongPress}
      style={dynamicStyles}
      left={buildAndroidIcon}
      right={buildRightCheckbox}
      titleNumberOfLines={1}
    />
  );
};

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default React.memo(DownloadedItem);
