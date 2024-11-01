import {create} from 'zustand';
import {Index} from '@/states/fetched/index';
import {DefaultProviders} from '@/states/persistent/defaultProviders';
import {Versions} from '@/states/computed/versions';
import {deepEqual} from 'fast-equals';

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
      deepEqual(state.updates, newUpdates) ? state : {updates: newUpdates},
    );

    return newUpdates;
  },
}));
