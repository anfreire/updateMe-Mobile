import * as React from 'react';
import {useDefaultProviders} from '@/states/persistent/defaultProviders';
import {useIndex} from '@/states/fetched/index';
import {useVersions} from '@/states/computed/versions';
import {useUpdates} from '@/states/computed/updates';
import {useShallow} from 'zustand/react/shallow';

function useStatesBridge() {
  const [isIndexFetched, index] = useIndex(state => [
    state.isFetched,
    state.index,
  ]);
  const [
    defaultProviders,
    populatedDefaultProviders,
    sanitizeDefaultProviders,
    populateDefaultProviders,
  ] = useDefaultProviders(
    useShallow(state => [
      state.defaultProviders,
      state.populatedDefaultProviders,
      state.sanitize,
      state.populate,
    ]),
  );
  const [versions, refreshVersions] = useVersions(state => [
    state.versions,
    state.refresh,
  ]);
  const refreshUpdates = useUpdates(state => state.refresh);

  React.useEffect(() => {
    if (!isIndexFetched) return;
    console.debug(
      '[src/states/bridge.tsx]\nSanitizing default providers:\n- index',
    );
    sanitizeDefaultProviders(index);
  }, [index, isIndexFetched]);

  React.useEffect(() => {
    if (!isIndexFetched) return;
    console.debug(
      '[src/states/bridge.tsx]\nPopulating default providers:\n- index\n- defaultProviders',
    );
    populateDefaultProviders(index);
  }, [defaultProviders, index, isIndexFetched]);

  React.useEffect(() => {
    if (!isIndexFetched) return;
    console.debug(
      '[src/states/bridge.tsx]\nRefreshing versions\n- index\n- populatedDefaultProviders',
    );
    refreshVersions(index, populatedDefaultProviders);
  }, [index, populatedDefaultProviders, isIndexFetched]);

  React.useEffect(() => {
    if (!isIndexFetched) return;
    console.debug(
      '[src/states/bridge.tsx]\nRefreshing updates\n- index\n- populatedDefaultProviders\n- versions',
    );
    refreshUpdates(index, populatedDefaultProviders, versions);
  }, [index, populatedDefaultProviders, versions, isIndexFetched]);
}

const StatesBridgeManager = () => {
  useStatesBridge();
  console.log('[src/states/bridge.tsx]\nState bridge manager rendered');

  return null;
};

StatesBridgeManager.displayName = 'StatesBridgeManager';

export default StatesBridgeManager;
