import * as React from 'react';
import {List} from 'react-native-paper';
import {Download} from '@/states/runtime/downloads';
import {useTranslations} from '@/states/persistent/translations';
import DownloadingItem from './DownloadingItem';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useDownloading() {
  const translations = useTranslations(state => state.translations);

  const sectionTitle = translations['Downloading'];

  return {sectionTitle};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface DownloadingProps {
  downloads: Record<string, Download>;
}

const Downloading = ({downloads}: DownloadingProps) => {
  const {sectionTitle} = useDownloading();

  if (Object.keys(downloads).length === 0) {
    return null;
  }

  return (
    <List.Section title={sectionTitle}>
      {Object.keys(downloads).map(download => (
        <DownloadingItem
          key={download}
          download={download}
          progress={downloads[download].progress}
        />
      ))}
    </List.Section>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default Downloading;
