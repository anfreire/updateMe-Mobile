import { create } from "zustand";
import isEqual from "react-fast-compare";

const TIPS_URL =
  "https://raw.githubusercontent.com/anfreire/updateMe-Data/main/tips.json";

export interface Tip {
  description: string;
  content: {
    image: string;
    description: string;
  }[];
}

export type Tips = Record<string, Tip>;

type useTipsState = {
  tips: Tips;
  isFetched: boolean;
};

type useTipsActions = {
  fetch: () => Promise<Tips | null>;
};

export type useTipsProps = useTipsState & useTipsActions;

export const useTips = create<useTipsProps>((set) => ({
  tips: {},
  isFetched: false,
  fetch: async () => {
    set({ isFetched: false });
    try {
      const response = await fetch(TIPS_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newTips = (await response.json()) as Tips;
      set((state) =>
        isEqual(state.tips, newTips)
          ? { isFetched: true }
          : { tips: newTips, isFetched: true }
      );
      return newTips;
    } catch (error) {
      console.error(`Error fetching tips: ${error}`);
      set({ isFetched: true });
      return null;
    }
  },
}));
