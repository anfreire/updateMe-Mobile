import {StateStorage, createJSONStorage, persist} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';
import {create} from 'zustand';
import {deepEqual} from 'fast-equals';
import {migrate} from '../utils';

const STORAGE_ID = 'notifications' as const;

const PERSISTED_KEYS: Array<keyof useNotificationsState> = [
  'newVersionsNotifications',
];

const DEFAULT_STATE = {
  newVersionsNotifications: {},
};

const storage = new MMKV({id: STORAGE_ID});

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: name => storage.getString(name) ?? null,
  removeItem: name => storage.delete(name),
};

type NewVersionNotification = {
  version: string;
  sha256?: string;
};

type useNotificationsState = {
  newVersionsNotifications: Record<string, NewVersionNotification>;
};

type useNotificationsActions = {
  registerNewVersionNotification: (
    appName: string,
    version: string,
    sha256?: string,
  ) => void;
};

export type useNotificationsProps = useNotificationsState &
  useNotificationsActions;

export const useNotifications = create<useNotificationsProps>()(
  persist(
    set => ({
      newVersionsNotifications: {},
      registerNewVersionNotification: (
        appName,
        version,
        sha256 = undefined,
      ) => {
        set(state => {
          const newVersionsNotifications = {
            ...state.newVersionsNotifications,
            [appName]: {
              version,
              sha256,
            },
          };
          return deepEqual(
            state.newVersionsNotifications,
            newVersionsNotifications,
          )
            ? state
            : {newVersionsNotifications};
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
            PERSISTED_KEYS.includes(key as keyof useNotificationsState),
          ),
        ),
    },
  ),
);
