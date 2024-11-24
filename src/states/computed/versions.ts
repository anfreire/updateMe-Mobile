import AppsModule from '@/lib/apps';
import {create} from 'zustand';
import {Index} from '@/states/fetched/index';
import {deepEqual} from 'fast-equals';
import {PopulatedDefaultProviders} from './providers';

export type Versions = Record<string, string | null>;

interface useVersionsState {
  versions: Versions;
}

interface useVersionsActions {
  refresh: (
    index: Index,
    populatedDefaultProviders: PopulatedDefaultProviders,
  ) => Promise<Versions>;
}

export type useVersionsProps = useVersionsState & useVersionsActions;

export const useVersions = create<useVersionsProps>(set => ({
  versions: {},
  refresh: async (index, populatedDefaultProviders) => {
    const entries = await Promise.all(
      Object.entries(populatedDefaultProviders).map(async ([app, provider]) => [
        app,
        await AppsModule.getAppVersion(
          index[app].providers[provider].packageName,
        ),
      ]),
    );

    const newVersions = Object.fromEntries(entries);

    set(state =>
      deepEqual(state.versions, newVersions) ? state : {versions: newVersions},
    );

    return newVersions;
  },
}));
