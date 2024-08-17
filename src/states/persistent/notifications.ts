import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";

const storage = new MMKV({ id: "notifications" });

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};

export interface useNotificationsProps {
  sentNotifications: Record<string, string>;
  setSentNotifications: (appName: string, version: string) => void;
}

export const useNotifications = create<useNotificationsProps>()(
  persist(
    (set) => ({
      sentNotifications: {},
      setSentNotifications: (appName: string, version: string) => {
        set((state) => ({
          sentNotifications: {
            ...state.sentNotifications,
            [appName]: version,
          },
        }));
      },
    }),
    {
      name: "notifications",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
