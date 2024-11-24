import * as React from 'react';
import {
  IndexApp,
  IndexAppProps,
  IndexAppProviderProps,
  useIndex,
} from '@/states/fetched';
import {useVersions} from '@/states/computed/versions';
import {useProviders} from '@/states/computed/providers';
import {useSettings} from '@/states/persistent/settings';
import {useShallow} from 'zustand/react/shallow';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function buildProviders(
  appName: string,
  providers: Record<string, IndexAppProviderProps>,
  defaultProviders: Record<string, string>,
  providersOrder: string[],
) {
  const defaultProvider = defaultProviders[appName];
  const orderMap = new Map(providersOrder.map((p, i) => [p, i]));

  return Object.fromEntries(
    Object.entries(providers).sort(([keyA, _], [keyB, __]) => {
      if (keyA === defaultProvider) return -1;
      if (keyB === defaultProvider) return 1;

      const orderA = orderMap.get(keyA);
      const orderB = orderMap.get(keyB);

      if (orderA !== undefined && orderB !== undefined) {
        return orderA - orderB;
      }

      if (orderA !== undefined) return -1;
      if (orderB !== undefined) return 1;

      return 0;
    }),
  );
}
/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export interface CurrAppProps extends IndexAppProps {
  title: IndexApp;
  defaultProviderTitle: string;
  defaultProvider: IndexAppProviderProps;
  version: string | null;
}

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

export function useCurrApp(appTitle: string | null): CurrAppProps | null {
  const index = useIndex(state => state.index);
  const populatedDefaultProviders = useProviders(
    state => state.populatedDefaultProviders,
  );
  const [defaultProviders, providersOrder] = useSettings(
    useShallow(state => [
      state.settings.providers.defaultProviders,
      state.settings.providers.providersOrder,
    ]),
  );
  const versions = useVersions(state => state.versions);

  return React.useMemo(() => {
    if (!appTitle) {
      return null;
    }
    return {
      ...index[appTitle],
      title: appTitle,
      providers: buildProviders(
        appTitle,
        index[appTitle].providers,
        defaultProviders,
        providersOrder,
      ),
      defaultProviderTitle: populatedDefaultProviders[appTitle],
      defaultProvider:
        index[appTitle].providers[populatedDefaultProviders[appTitle]],
      version: versions[appTitle],
    };
  }, [
    appTitle,
    index,
    populatedDefaultProviders,
    versions,
    defaultProviders,
    providersOrder,
  ]);
}
