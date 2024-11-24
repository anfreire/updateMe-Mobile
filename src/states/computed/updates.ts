import {create} from 'zustand';
import {Index} from '@/states/fetched/index';
import {Versions} from '@/states/computed/versions';
import {deepEqual} from 'fast-equals';
import {useInstallationsProps} from '../persistent/installations';
import {PopulatedDefaultProviders} from './providers';

export type Updates = string[];

interface useUpdatesState {
  updates: Updates;
}

interface useUpdatesActions {
  refresh: (
    index: Index,
    populatedDefaultProviders: PopulatedDefaultProviders,
    versions: Versions,
    installations: useInstallationsProps['installations'],
    ignoredApps: string[],
  ) => Updates;
}

export type useUpdatesProps = useUpdatesState & useUpdatesActions;

export const useUpdates = create<useUpdatesProps>(set => ({
  updates: [],
  refresh: (
    index,
    populatedDefaultProviders,
    versions,
    installations,
    ignoredApps,
  ) => {
    const newUpdates: Updates = [];

    for (const [app, provider] of Object.entries(populatedDefaultProviders)) {
      const currentVersion = versions[app];
      const newVersion = index[app]['providers'][provider].version;

      if (
        !ignoredApps.includes(app) &&
        currentVersion &&
        (newVersion > currentVersion ||
          (installations[app] &&
            installations[app].sha256 !==
              index[app]['providers'][provider].sha256))
      ) {
        newUpdates.push(app);
      }
    }

    set(state =>
      deepEqual(state.updates, newUpdates) ? state : {updates: newUpdates},
    );

    return newUpdates;
  },
}));
