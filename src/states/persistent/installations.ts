import {StateStorage, createJSONStorage, persist} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';
import {create} from 'zustand';
import {deepEqual} from 'fast-equals';
import { migrate } from '../utils';

const STORAGE_ID = 'installations' as const;

const PERSISTED_KEYS: Array<keyof useInstallationsState> = ['installations'];

const DEFAULT_STATE = {
  installations: {},
};

const storage = new MMKV({id: STORAGE_ID});

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: name => storage.getString(name) ?? null,
  removeItem: name => storage.delete(name),
};

type Installation = {
  version: string;
  sha256: string;
};

type useInstallationsState = {
  installations: Record<string, Installation>;
};

type useInstallationsActions = {
  registerInstallation: (
    appName: string,
    version: string,
    sha256: string,
  ) => void;
};

export type useInstallationsProps = useInstallationsState &
  useInstallationsActions;

export const useInstallations = create<useInstallationsProps>()(
  persist(
    set => ({
      installations: {},
      registerInstallation: (appName, version, sha256) => {
        set(state => {
          const installations = {
            ...state.installations,
            [appName]: {
              version,
              sha256,
            },
          };
          return deepEqual(state.installations, installations)
            ? state
            : {installations};
        });
      },
    }),
    {
      name: STORAGE_ID,
      storage: createJSONStorage(() => zustandStorage),
      migrate: (persistedState, version) =>
        migrate(DEFAULT_STATE, persistedState, version),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            PERSISTED_KEYS.includes(key as keyof useInstallationsState),
          ),
        ),
    },
  ),
);
