import * as React from 'react';
import {
  IndexApp,
  IndexAppProps,
  IndexAppProviderProps,
  useIndex,
} from '@/states/fetched';
import {useDefaultProviders} from '@/states/persistent/defaultProviders';
import {useVersions} from '@/states/computed/versions';

export interface CurrAppProps extends IndexAppProps {
  title: IndexApp;
  defaultProviderTitle: string;
  defaultProvider: IndexAppProviderProps;
  version: string | null;
}

export function useCurrApp(appTitle: string | null): CurrAppProps | null {
  const index = useIndex(state => state.index);
  const populatedDefaultProviders = useDefaultProviders(
    state => state.populatedDefaultProviders,
  );
  const versions = useVersions(state => state.versions);

  return React.useMemo(() => {
    if (!appTitle) {
      return null;
    }
    return {
      ...index[appTitle],
      title: appTitle,
      defaultProviderTitle: populatedDefaultProviders[appTitle],
      defaultProvider:
        index[appTitle].providers[populatedDefaultProviders[appTitle]],
      version: versions[appTitle],
    };
  }, [appTitle, index, populatedDefaultProviders, versions]);
}
