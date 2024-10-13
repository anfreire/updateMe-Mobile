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
    sanitizeDefaultProviders(index);
  }, [index, isIndexFetched]);

  React.useEffect(() => {
    if (!isIndexFetched) return;
    populateDefaultProviders(index);
  }, [defaultProviders, index, isIndexFetched]);

  React.useEffect(() => {
    if (!isIndexFetched) return;
    refreshVersions(index, populatedDefaultProviders);
  }, [index, populatedDefaultProviders, isIndexFetched]);

  React.useEffect(() => {
    if (!isIndexFetched) return;
    refreshUpdates(index, populatedDefaultProviders, versions);
  }, [index, populatedDefaultProviders, versions, isIndexFetched]);
}

const StatesBridgeManager = () => {
  useStatesBridge();

  return null;
};

StatesBridgeManager.displayName = 'StatesBridgeManager';

export default StatesBridgeManager;
