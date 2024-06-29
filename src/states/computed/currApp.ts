import {create} from 'zustand';
import {AppProps, IndexProps, useIndex} from '@/states/temporary/index';
import {useDefaultProviders} from '../persistent/defaultProviders';
import {useVersions} from './versions';

export interface CurrAppProps extends AppProps {
  name: string;
  version: string | null;
  defaultProvider: string;
}

export interface useCurrAppProps {
  currApp: CurrAppProps | null;
  setCurrApp: (
    appName: string | null,
    {
      index,
      versions,
      defaultProviders,
    }?: {
      index?: IndexProps;
      versions?: Record<string, string | null>;
      defaultProviders?: Record<string, string>;
    },
  ) => void;
  refresh: ({
    index,
    versions,
    defaultProviders,
  }?: {
    index?: IndexProps;
    versions?: Record<string, string | null>;
    defaultProviders?: Record<string, string>;
  }) => void;
}

export const useCurrApp = create<useCurrAppProps>((set, get) => ({
  currApp: null,
  setCurrApp: (appName, {index, versions, defaultProviders} = {}) => {
    if (appName === null) {
      set({currApp: null});
      return;
    }
    index ||= useIndex.getState().index;
    versions ||= useVersions.getState().versions;
    defaultProviders ||= useDefaultProviders.getState().defaultProviders;
    const defaultProvider =
      defaultProviders[appName] || Object.keys(index[appName].providers)[0];
    set({
      currApp: {
        ...index[appName],
        name: appName,
        version: versions[appName] ?? null,
        defaultProvider,
      },
    });
  },
  refresh: ({index, versions, defaultProviders} = {}) => {
    const currApp = get().currApp;
    if (currApp === null) return;
    index ||= useIndex.getState().index;
    versions ||= useVersions.getState().versions;
    defaultProviders ||= useDefaultProviders.getState().defaultProviders;
    const defaultProvider =
      defaultProviders[currApp.name] ||
      Object.keys(index[currApp.name].providers)[0];
    set({
      currApp: {
        ...index[currApp.name],
        name: currApp.name,
        version: versions[currApp.name] ?? null,
        defaultProvider,
      },
    });
  },
}));
