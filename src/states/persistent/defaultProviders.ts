import {StateStorage, createJSONStorage, persist} from 'zustand/middleware';
import { IndexProps, useIndex } from '@/states/temporary/index';
import {MMKV} from 'react-native-mmkv';
import {create} from 'zustand';

const storage = new MMKV({id: 'default-providers'});

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: name => {
    return storage.getString(name) || null;
  },
  removeItem: name => {
    return storage.delete(name);
  },
};

export interface useDefaultProvidersProps {
  defaultProviders: Record<string, string>;
  setDefaultProvider: (appName: string, provider: string) => void;
  sanitize: (index?: IndexProps) => void;
}

export const useDefaultProviders = create<useDefaultProvidersProps>()(
  persist(
    (set, get) => ({
      defaultProviders: {},
      setDefaultProvider: (appName: string, provider: string) => {
        set(state => ({
          defaultProviders: {
            ...state.defaultProviders,
            [appName]: provider,
          },
        }));
      },
      sanitize: (index?: IndexProps) => {
        index ||= useIndex.getState().index;
        let filteredProviders: Record<string, string> = {};
        for (const appName in get().defaultProviders) {
          if (!(appName in index) || !(get().defaultProviders[appName] in index[appName].providers)) {
            continue;
          }
          filteredProviders[appName] = get().defaultProviders[appName];
        }
        if (JSON.stringify(filteredProviders) !== JSON.stringify(get().defaultProviders)) {
          set({defaultProviders: filteredProviders});
        }
      }
    }),
    {
      name: 'default-providers',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
