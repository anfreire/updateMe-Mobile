import {StateStorage, createJSONStorage, persist} from 'zustand/middleware';
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
}

export const useDefaultProviders = create<useDefaultProvidersProps>()(
  persist(
    set => ({
      defaultProviders: {},
      setDefaultProvider: (appName: string, provider: string) => {
        set(state => ({
          defaultProviders: {
            ...state.defaultProviders,
            [appName]: provider,
          },
        }));
      },
    }),
    {
      name: 'default-providers',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
