import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";

export interface SettingsProps {
	layout: {
		homeStyle: "categories" | "list" | "grid";
	};
	theme: {
		sourceColor: string | null;
		colorScheme: "system" | "light" | "dark";
	};
	notifications: {
		updatesNotification: boolean;
		newReleaseNotification: boolean;
	};
	downloads: {
		installAfterDownload: boolean;
		deleteOnLeave: boolean;
	};
	security: {
		installUnsafeApps: boolean;
	};
}

const DEFAULT_SETTINGS: SettingsProps = {
	layout: {
		homeStyle: "categories",
	},
	theme: {
		sourceColor: null,
		colorScheme: "system",
	},
	notifications: {
		updatesNotification: true,
		newReleaseNotification: true,
	},
	downloads: {
		installAfterDownload: true,
		deleteOnLeave: true,
	},
	security: {
		installUnsafeApps: false,
	},
};

export type SettingsSectionType = keyof SettingsProps;

export type SettingsSectionItemType<T extends SettingsSectionType> =
	keyof SettingsProps[T];

export type SettingsSectionItemValueType<T extends SettingsSectionType> =
	SettingsProps[T][SettingsSectionItemType<T>];

const storage = new MMKV({ id: "settings" });

const zustandStorage: StateStorage = {
	setItem: (name, value) => {
		return storage.set(name, JSON.stringify(value));
	},
	getItem: (name) => {
		const value = storage.getString(name);
		return value ? JSON.parse(value) : null;
	},
	removeItem: (name) => {
		return storage.delete(name);
	},
};

export interface useSettingsProps {
	settings: SettingsProps;
	setSetting: <
		T extends SettingsSectionType,
		K extends SettingsSectionItemType<T>,
	>(
		key: T,
		item: K,
		value: SettingsSectionItemValueType<T>,
	) => void;
	toggleSetting: <
		T extends SettingsSectionType,
		K extends SettingsSectionItemType<T>,
	>(
		key: T,
		item: K,
	) => void;
	resetSetting: <
		T extends SettingsSectionType,
		K extends SettingsSectionItemType<T>,
	>(
		key: T,
		item: K,
	) => void;
}

export const useSettings = create<useSettingsProps>()(
	persist(
		(set, get) => ({
			settings: DEFAULT_SETTINGS,
			setSetting: <
				T extends SettingsSectionType,
				K extends SettingsSectionItemType<T>,
			>(
				key: T,
				item: K,
				value: SettingsSectionItemValueType<T>,
			) => {
				set({
					settings: {
						...get().settings,
						[key]: { ...get().settings[key], [item]: value },
					},
				});
			},
			toggleSetting: <
				T extends SettingsSectionType,
				K extends SettingsSectionItemType<T>,
			>(
				key: T,
				item: K,
			) => {
				set({
					settings: {
						...get().settings,
						[key]: {
							...get().settings[key],
							[item]: !get().settings[key][item],
						},
					},
				});
			},
			resetSetting: <
				T extends SettingsSectionType,
				K extends SettingsSectionItemType<T>,
			>(
				key: T,
				item: K,
			) => {
				set({
					settings: {
						...get().settings,
						[key]: {
							...get().settings[key],
							[item]: DEFAULT_SETTINGS[key][item],
						},
					},
				});
			},
		}),
		{
			name: "settings",
			storage: createJSONStorage(() => zustandStorage),
		},
	),
);
