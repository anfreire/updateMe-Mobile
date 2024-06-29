import {StateStorage, createJSONStorage, persist} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';
import {create} from 'zustand';

const storage = new MMKV({id: 'background'});

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

export interface useBackgroundProps {
  background: Record<string, string>;
  setBackground: (appName: string, version: string) => void;
}

export const useBackground = create<useBackgroundProps>()(
  persist(
    set => ({
      background: {},
      setBackground: (appName: string, version: string) => {
        set(state => ({
          background: {
            ...state.background,
            [appName]: version,
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
