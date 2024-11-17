import * as React from 'react';
import {useIndex} from '@/states/fetched/index';
import {useVersions} from '@/states/computed/versions';
import {useUpdates} from '@/states/computed/updates';
import {useShallow} from 'zustand/react/shallow';
import {useInstallations} from './persistent/installations';
import {useSettings} from './persistent/settings';
import {useProviders} from './computed/providers';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useStatesBridge() {
  const [
    ignoredApps,
    defaultProviders,
    providersOrder,
    setSettingsWithPrevious,
  ] = useSettings(
    useShallow(state => [
      state.settings.apps.ignoredApps,
      state.settings.providers.defaultProviders,
      state.settings.providers.providersOrder,
      state.setSettingWithPrevious,
    ]),
  );
  const [isIndexFetched, index] = useIndex(state => [
    state.isFetched,
    state.index,
  ]);
  const [populatedDefaultProviders, populateDefaultProviders] = useProviders(
    useShallow(state => [state.populatedDefaultProviders, state.populate]),
  );
  const installations = useInstallations(state => state.installations);
  const [versions, refreshVersions] = useVersions(state => [
    state.versions,
    state.refresh,
  ]);
  const refreshUpdates = useUpdates(state => state.refresh);

  React.useEffect(() => {
    if (!isIndexFetched) return;
    // Sanitize defaultProviders
    setSettingsWithPrevious('providers', 'defaultProviders', prev =>
      Object.fromEntries(
        Object.entries(prev).filter(
          ([appName, provider]) =>
            appName in index && provider in index[appName].providers,
        ),
      ),
    );
    setSettingsWithPrevious('providers', 'providersOrder', prev =>
      prev.filter(appName => appName in index),
    );
    setSettingsWithPrevious('apps', 'ignoredApps', prev =>
      prev.filter(appName => appName in index),
    );
  }, [index, isIndexFetched]);

  React.useEffect(() => {
    if (!isIndexFetched) return;
    populateDefaultProviders(index, defaultProviders, providersOrder);
  }, [defaultProviders, index, isIndexFetched, providersOrder]);

  React.useEffect(() => {
    if (!isIndexFetched) return;
    refreshVersions(index, populatedDefaultProviders);
  }, [index, populatedDefaultProviders, isIndexFetched]);

  React.useEffect(() => {
    if (!isIndexFetched) return;
    refreshUpdates(
      index,
      populatedDefaultProviders,
      versions,
      installations,
      ignoredApps,
    );
  }, [
    index,
    populatedDefaultProviders,
    versions,
    isIndexFetched,
    installations,
    ignoredApps,
  ]);
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const StatesBridgeManager = () => {
  useStatesBridge();

  return null;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default StatesBridgeManager;
