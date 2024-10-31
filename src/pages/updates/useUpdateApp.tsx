import * as React from 'react';
import FilesModule from '@/lib/files';
import {interpolate, useTranslations} from '@/states/persistent/translations';
import {useIndex} from '@/states/fetched';
import {useDefaultProviders} from '@/states/persistent/defaultProviders';
import {useDownloads} from '@/states/runtime/downloads';
import {useSettings} from '@/states/persistent/settings';
import {useToast} from '@/states/runtime/toast';

export function useUpdateApp({
  setUpdating,
}: {
  setUpdating: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const translations = useTranslations(state => state.translations);
  const index = useIndex(state => state.index);
  const populatedDefaultProviders = useDefaultProviders(
    state => state.populatedDefaultProviders,
  );
  const addDownload = useDownloads(state => state.addDownload);
  const installAfterDownload = useSettings(
    state => state.settings.downloads.installAfterDownload,
  );
  const openToast = useToast(state => state.openToast);

  return React.useCallback(
    (appName: string) => {
      const fileName = FilesModule.buildFileName(
        appName,
        index[appName].providers[populatedDefaultProviders[appName]].version,
      );
      setUpdating(prev => ({...prev, [appName]: fileName}));
      addDownload(
        fileName,
        index[appName].providers[populatedDefaultProviders[appName]].download,
        undefined,
        path => {
          setUpdating(prev => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {[appName]: _, ...rest} = prev;
            return rest;
          });
          if (installAfterDownload) {
            FilesModule.installApk(path);
          } else {
            openToast(
              interpolate(translations['$1 finished downloading'], appName),
              {
                action: {
                  label: translations['Install'],
                  onPress: () => FilesModule.installApk(path),
                },
              },
            );
          }
        },
      );
    },
    [
      translations,
      populatedDefaultProviders,
      index,
      installAfterDownload,
      setUpdating,
    ],
  );
}
