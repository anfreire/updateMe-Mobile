import {StateStorage, createJSONStorage, persist} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';
import {create} from 'zustand';
import {deepEqual} from 'fast-equals';

const STORAGE_ID = 'notifications' as const;

const PERSISTENT_KEYS: Array<keyof useNotificationsState> = [
  'newVersionsNotifications',
];

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
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            PERSISTENT_KEYS.includes(key as keyof useNotificationsState),
          ),
        ),
    },
  ),
);
