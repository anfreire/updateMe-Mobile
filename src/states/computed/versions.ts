import AppsModule from '@/lib/apps';
import {IndexProps, useIndex} from '../temporary';
import {create} from 'zustand';
import {useDefaultProviders} from '@/states/persistent/defaultProviders';

export interface useVersionsProps {
  versions: Record<string, string | null>;
  updates: string[];
  refresh: ({
    defaultProviders,
    index,
  }?: {
    defaultProviders?: Record<string, string>;
    index?: IndexProps;
  }) => Promise<{versions: Record<string, string | null>; updates: string[]}>;
}

export const useVersions = create<useVersionsProps>(set => ({
  versions: {},
  updates: [],
  refresh: async ({defaultProviders, index} = {}) => {
    defaultProviders ||= useDefaultProviders.getState().defaultProviders;
    index ||= useIndex.getState().index;
    let newVersions: Record<string, string | null> = {};
    let newUpdates: string[] = [];
    await Promise.all(
      Object.keys(index).map(async appName => {
        const defaultProvider = Object.keys(defaultProviders).includes(appName)
          ? defaultProviders[appName]
          : Object.keys(index[appName].providers)[0];
        newVersions[appName] = await AppsModule.getAppVersion(
          index[appName].providers[defaultProvider].packageName,
        );
        if (
          newVersions[appName] &&
          newVersions[appName]! <
            index[appName].providers[defaultProvider].version
        )
          newUpdates.push(appName);
      }),
    );
    set({versions: newVersions, updates: newUpdates});
    return {versions: newVersions, updates: newUpdates};
  },
}));
