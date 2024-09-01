import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import isEqual from "react-fast-compare";

const STORAGE_ID = "notifications" as const;

const storage = new MMKV({ id: STORAGE_ID });

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};

type useNotificationsState = {
  appsVersionsSent: Record<string, string>;
};

type useNotificationsActions = {
  addAppVersionSent: (appName: string, version: string) => void;
};

export type useNotificationsProps = useNotificationsState &
  useNotificationsActions;
export const useNotifications = create<useNotificationsProps>()(
  persist(
    (set) => ({
      appsVersionsSent: {},
      addAppVersionSent: (appName, version) => {
        set((state) => {
          const newAppsVersionsSent = {
            ...state.appsVersionsSent,
            [appName]: version,
          };
          return isEqual(state.appsVersionsSent, newAppsVersionsSent)
            ? state
            : { appsVersionsSent: newAppsVersionsSent };
        });
      },
    }),
    {
      name: STORAGE_ID,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
