import * as React from 'react';
import {List} from 'react-native-paper';
import {ReactNativeBlobUtilStat} from 'react-native-blob-util';
import {useDownloadsHeaderRight} from './useDownloadsHeaderRigh';
import DownloadedItem from './DownloadedItem';
import {useTranslations} from '@/states/persistent/translations';

/*******************************************************************************
 *                                     HOOK                                    *
 *******************************************************************************/

function useDownloaded(
  files: Record<string, ReactNativeBlobUtilStat>,
  updateFiles: () => void,
) {
  const translations = useTranslations(state => state.translations);
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);

  const sectionTitle = translations['Downloaded'];

  const selectFile = React.useCallback((file: string) => {
    setSelectedFiles(prev =>
      prev.includes(file) ? prev.filter(f => f !== file) : [...prev, file],
    );
  }, []);

  useDownloadsHeaderRight(selectedFiles, files, setSelectedFiles, updateFiles);

  return {selectedFiles, selectFile, sectionTitle};
}

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

const Downloaded = ({
  files,
  updateFiles,
}: {
  files: Record<string, ReactNativeBlobUtilStat>;
  updateFiles: () => void;
}) => {
  const {selectedFiles, selectFile, sectionTitle} = useDownloaded(
    files,
    updateFiles,
  );

  if (Object.keys(files).length === 0) {
    return null;
  }

  return (
    <List.Section title={sectionTitle}>
      {Object.entries(files).map(([file, fileStats]) => (
        <DownloadedItem
          key={file}
          file={file}
          fileStats={fileStats}
          selectFile={selectFile}
          selectedFiles={selectedFiles}
        />
      ))}
    </List.Section>
  );
};

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default React.memo(Downloaded);
