import {create} from 'zustand';
import {Index} from '@/states/fetched/index';
import {DefaultProviders} from '@/states/persistent/defaultProviders';
import {Versions} from '@/states/computed/versions';
import isEqual from 'react-fast-compare';

export type Updates = string[];

interface useUpdatesState {
  updates: Updates;
}

interface useUpdatesActions {
  refresh: (
    index: Index,
    populatedDefaultProviders: DefaultProviders,
    versions: Versions,
  ) => Updates;
}

export type useUpdatesProps = useUpdatesState & useUpdatesActions;

export const useUpdates = create<useUpdatesProps>(set => ({
  updates: [],
  refresh: (index, populatedDefaultProviders, versions) => {
    const newUpdates: Updates = Object.entries(
      populatedDefaultProviders,
    ).reduce((acc, [app, provider]) => {
      const currentVersion = versions[app];
      const newVersion = index[app]['providers'][provider].version;
      if (currentVersion && newVersion > currentVersion) {
        acc.push(app);
      }
      return acc;
    }, [] as Updates);

    set(state =>
      isEqual(state.updates, newUpdates) ? state : {updates: newUpdates},
    );

    return newUpdates;
  },
}));
