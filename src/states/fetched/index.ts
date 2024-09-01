import { create } from "zustand";
import { Logger } from "../persistent/logs";
import isEqual from "react-fast-compare";

const INDEX_URL =
  "https://raw.githubusercontent.com/anfreire/updateMe-Data/main/index.json" as const;

export interface IndexAppProviderProps {
  packageName: string;
  source: string;
  version: string;
  link: string;
  download: string;
  sha256: string;
  safe: boolean;
}

export interface IndexAppProps {
  icon: string;
  providers: Record<string, IndexAppProviderProps>;
  depends: string[];
  complements: string[];
  features: string[];
}

export type Index = Record<string, IndexAppProps>;
export type IndexApp = keyof Index;

interface useIndexState {
  index: Index;
  isFetched: boolean;
}

interface useIndexActions {
  fetch: () => Promise<Index | null>;
}

export type useIndexProps = useIndexState & useIndexActions;

export const useIndex = create<useIndexProps>((set) => ({
  index: {},
  isFetched: false,
  fetch: async () => {
    set({ isFetched: false });
    try {
      const response = await fetch(INDEX_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newIndex = (await response.json()) as Index;
      set((state) =>
        isEqual(state.index, newIndex)
          ? { isFetched: true }
          : { index: newIndex, isFetched: true }
      );
      return newIndex;
    } catch (error) {
      Logger.error(`Error fetching index: ${error}`);
      return null;
    }
  },
}));
