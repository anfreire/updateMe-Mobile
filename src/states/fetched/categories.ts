import { create } from "zustand";
import { Logger } from "../persistent/logs";
import { MultiIconType } from "@/components/multiIcon";
import isEqual from "react-fast-compare";

const CATEGORIES_URL =
  "https://raw.githubusercontent.com/anfreire/updateMe-Data/main/categories.json" as const;

export type Categories = Record<
  string,
  {
    apps: string[];
    icon: string;
    type?: MultiIconType;
  }
>;

type useCategoriesState = {
  categories: Categories;
  isFetched: boolean;
};

type useCategoriesActions = {
  fetch: () => Promise<Categories | null>;
};

export type useCategoriesProps = useCategoriesState & useCategoriesActions;

export const useCategories = create<useCategoriesProps>((set) => ({
  categories: {},
  isFetched: false,
  fetch: async () => {
    set({ isFetched: false });
    try {
      const response = await fetch(CATEGORIES_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newCategories = (await response.json()) as Categories;
      set((state) =>
        isEqual(state.categories, newCategories)
          ? { isFetched: true }
          : { categories: newCategories, isFetched: true }
      );
      return newCategories;
    } catch (error) {
      Logger.error(`Error fetching categories: ${error}`);
      set({ isFetched: true });
      return null;
    }
  },
}));
