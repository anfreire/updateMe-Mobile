import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";

const defaultTranslations = {
	"Tap on the middle circle to test the color":
		"Tap on the middle circle to test the color",

	"Source Color": "Source Color",

	Cancel: "Cancel",

	"Use System": "Use System",

	Save: "Save",

	Layout: "Layout",

	Opacity: "Opacity",

	"Update Me v%s is available!": "Update Me v%s is available!",

	"Download manually": "Download manually",

	Update: "Update",
} as const;

const storage = new MMKV({ id: "translations" });

const zustandStorage: StateStorage = {
	setItem: (name, value) => {
		return storage.set(name, value);
	},
	getItem: (name) => {
		return storage.getString(name) || name;
	},
	removeItem: (name) => {
		return storage.delete(name);
	},
};

type useTranslationsProps = Record<keyof typeof defaultTranslations, string>;

export const useTranslations = create<useTranslationsProps>()(
	persist(
		(set, get) => ({
			...defaultTranslations,
		}),
		{
			name: "translations",
			storage: createJSONStorage(() => zustandStorage),
		},
	),
);
