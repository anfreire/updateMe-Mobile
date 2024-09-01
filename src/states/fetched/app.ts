import { create } from "zustand";
import AppsModule from "@/lib/apps";
import { Logger } from "@/states/persistent/logs";
import isEqual from "react-fast-compare";

const APP_INFO_URL =
  "https://raw.githubusercontent.com/anfreire/updateMe-Data/main/app.json";

interface LatestAppInfo {
  version: string;
  download: string;
  releaseNotes: { title: string; description: string }[];
}

interface useAppState {
  localVersion: string;
  latest: LatestAppInfo;
  isFetched: boolean;
}

interface useAppActions {
  getLocalVersion: () => Promise<string>;
  fetch: () => Promise<LatestAppInfo | null>;
}

export type useAppProps = useAppState & useAppActions;

export const useApp = create<useAppProps>((set) => ({
  localVersion: "",
  latest: {
    version: "",
    download: "",
    releaseNotes: [],
  },
  isFetched: false,
  getLocalVersion: async () => {
    const version = (await AppsModule.getAppVersion("com.updateme")) as string;
    set({ localVersion: version });
    return version;
  },
  fetch: async () => {
    set({ isFetched: false });
    try {
      const response = await fetch(APP_INFO_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newLatest = (await response.json()) as LatestAppInfo;
      set((state) =>
        isEqual(state.latest, newLatest)
          ? { isFetched: true }
          : { latest: newLatest, isFetched: true }
      );
      return newLatest;
    } catch (error) {
      Logger.error(`Error fetching app info: ${error}`);
      return null;
    }
  },
}));
