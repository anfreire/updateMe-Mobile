import AppsModule from "@/lib/apps";
import { IndexProps } from "../temporary";
import { create } from "zustand";

interface StoresProps {
	index: IndexProps;
	defaultProviders: Record<string, string>;
}

export interface useVersionsProps {
	versions: Record<string, string | null>;
	updates: string[];
	refresh: ({ index, defaultProviders }: StoresProps) => Promise<{
		versions: Record<string, string | null>;
		updates: string[];
	}>;
}

export const useVersions = create<useVersionsProps>((set, get) => ({
	versions: {},
	updates: [],
	refresh: async ({ index, defaultProviders }) => {
		let newVersions: Record<string, string | null> = {};
		let newUpdates: string[] = [];
		await Promise.all(
			Object.keys(index).map(async (appName) => {
				const defaultProvider = Object.keys(defaultProviders).includes(
					appName,
				)
					? defaultProviders[appName]
					: Object.keys(index[appName].providers)[0];
				newVersions[appName] = await AppsModule.getAppVersion(
					index[appName].providers[defaultProvider].packageName,
				);
				if (
					newVersions[appName] &&
					newVersions[appName]! <
						index[appName].providers[defaultProvider].version
				)
					newUpdates.push(appName);
			}),
		);

		if (JSON.stringify(newVersions) !== JSON.stringify(get().versions))
			set({ versions: newVersions });

		if (JSON.stringify(newUpdates) !== JSON.stringify(get().updates))
			set({ updates: newUpdates });

		return { versions: newVersions, updates: newUpdates };
	},
}));
