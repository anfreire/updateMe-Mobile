import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";

const storage = new MMKV({ id: "notifications" });

const zustandStorage: StateStorage = {
	setItem: (name, value) => {
		return storage.set(name, value);
	},
	getItem: (name) => {
		return storage.getString(name) || null;
	},
	removeItem: (name) => {
		return storage.delete(name);
	},
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
			name: "default-providers",
			storage: createJSONStorage(() => zustandStorage),
		},
	),
);
