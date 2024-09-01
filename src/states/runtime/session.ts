import { INITIAL_PAGE, Page } from "@/types/navigation";
import {
  INITIAL_SESSION_FLAGS,
  INITIAL_SESSION_TRACKERS,
  SessionFlags,
  SessionTrackers,
} from "@/types/session";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { Logger } from "../persistent/logs";

const STORAGE_ID = "session" as const;

const storage = new MMKV({ id: STORAGE_ID });

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};

type useSessionState = {
  token: string | null;
  currPage: Page;
  flags: SessionFlags;
  trackers: SessionTrackers;
};

type useSessionActions = {
  setCurrPage: (page: Page) => void;
  activateFlag: (key: keyof SessionFlags) => void;
  addTracker: (key: keyof SessionTrackers, value: string) => void;
  geenrateToken: () => void;
};

export type useSessionProps = useSessionState & useSessionActions;

export const useSession = create<useSessionProps>()(
  persist(
    (set) => ({
      token: null,
      currPage: INITIAL_PAGE,
      flags: INITIAL_SESSION_FLAGS,
      trackers: INITIAL_SESSION_TRACKERS,
      setCurrPage: (page) => {
        set((state) =>
          state.currPage === page ? state : { ...state, currPage: page }
        );
      },
      activateFlag: (key) => {
        set((state) => ({ flags: { ...state.flags, [key]: true } }));
      },
      addTracker: (key, value) => {
        set((state) =>
          state.trackers[key].includes(value)
            ? state
            : {
                trackers: {
                  ...state.trackers,
                  [key]: [...state.trackers[key], value],
                },
              }
        );
      },
      geenrateToken: () => {
        const timestamp = Date.now().toString(36);
        const randomString = Math.random().toString(36).substring(2, 15);
        set({ token: `${timestamp}-${randomString}` });
      },
    }),
    {
      name: STORAGE_ID,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            Logger.error(`Failed to rehydrate ${STORAGE_ID} state: ${error}`);
          }
          if (!state?.token) {
            useSession.getState().geenrateToken();
          }
          useSession.setState({
            currPage: INITIAL_PAGE,
            flags: INITIAL_SESSION_FLAGS,
            trackers: INITIAL_SESSION_TRACKERS,
          });
        };
      },
    }
  )
);

export async function ensureTokenCreation(): Promise<boolean> {
  if (useSession.persist.hasHydrated()) return true;
  await useSession.persist.rehydrate();
  return useSession.persist.hasHydrated();
}
