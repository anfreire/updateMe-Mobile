import { MainStackPage } from "@/navigation";
import { HomeStackPage } from "@/navigation/apps";
import { TipsStackPage } from "@/navigation/tips";
import { create } from "zustand";

export type Page = MainStackPage | HomeStackPage | TipsStackPage;
const INITIAL_PAGE: Page = "loading";

export interface SessionFlags {
  downloadsOpenedDrawer: boolean;
}
export type SessionFlagsKeys = keyof SessionFlags;
const INITIAL_FLAGS: SessionFlags = {
  downloadsOpenedDrawer: false,
};

export interface SessionTrackers {
  updatesBannerDismissed: string[];
}
export type SessionTrackersKeys = keyof SessionTrackers;
const INITIAL_TRACKERS: SessionTrackers = {
  updatesBannerDismissed: [],
};

export interface useSessionProps {
  currPage: Page;
  flags: SessionFlags;
  trackers: SessionTrackers;
  setCurrPage: (page: Page) => void;
  activateFlag: (key: SessionFlagsKeys) => void;
  addTracker: (key: SessionTrackersKeys, value: string) => void;
}

export const useSession = create<useSessionProps>((set, get) => ({
  currPage: INITIAL_PAGE,
  flags: INITIAL_FLAGS,
  trackers: INITIAL_TRACKERS,
  setCurrPage: (page) => {
    if (get().currPage !== page) set({ currPage: page });
  },
  activateFlag: (key) => {
    set((state) => ({ flags: { ...state.flags, [key]: true } }));
  },
  addTracker: (key, value) => {
    if (!get().trackers[key].includes(value))
      set((state) => ({
        trackers: {
          ...state.trackers,
          [key]: [...state.trackers[key], value],
        },
      }));
  },
}));
