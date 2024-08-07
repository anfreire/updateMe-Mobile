import { create } from "zustand";
import { useVersions } from "../computed/versions";

const INDEX_URL =
	"https://raw.githubusercontent.com/anfreire/updateMe-Data/main/index.json";
const CATEGORIES_URL =
	"https://raw.githubusercontent.com/anfreire/updateMe-Data/main/categories.json";

export interface AppProviderProps {
	packageName: string;
	source: string;
	version: string;
	link: string;
	download: string;
	sha256: string;
	safe: boolean;
}

export interface AppProps {
	icon: string;
	providers: Record<string, AppProviderProps>;
	depends: string[];
	complements: string[];
	features: string[];
}

export type IndexProps = Record<string, AppProps>;

export type CategoriesProps = Record<
	string,
	{
		apps: string[];
		icon: string;
		type: undefined | string;
	}
>;

interface useIndexProps {
	index: IndexProps;
	categories: CategoriesProps;
	isLoaded: boolean;
	fetchIndex: () => Promise<IndexProps | null>;
	fetchCategories: () => Promise<CategoriesProps | null>;
	fetch: () => Promise<{
		index: IndexProps;
		categories: CategoriesProps;
	} | null>;
}

export const useIndex = create<useIndexProps>((set, get) => ({
	index: {},
	categories: {},
	isLoaded: false,
	fetchIndex: async () => {
		try {
			const response = await fetch(INDEX_URL);
			const index = (await response.json()) as IndexProps;
			if (JSON.stringify(index) !== JSON.stringify(get().index))
				set({ index });
			return index;
		} catch (error) {
			return null;
		}
	},
	fetchCategories: async () => {
		try {
			const response = await fetch(CATEGORIES_URL);
			const categories = (await response.json()) as CategoriesProps;
			if (JSON.stringify(categories) !== JSON.stringify(get().categories))
				set({ categories });
			return categories;
		} catch (error) {
			return null;
		}
	},
	fetch: async () => {
		set({ isLoaded: false, index: {}, categories: {} });
		const index = await get().fetchIndex();
		const categories = await get().fetchCategories();
		if (!index || !categories) return null;
		set({ isLoaded: true });
		return { index, categories };
	},
}));
