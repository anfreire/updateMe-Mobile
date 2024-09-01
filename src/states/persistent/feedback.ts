import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";

const STORAGE_ID = "feedback" as const;

const storage = new MMKV({ id: STORAGE_ID });

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};

const ONE_DAY_MS = 86400000 as const;

type useFeedbackState = {
  lastReport: number | null;
  lastSuggestion: number | null;
};

type useFeedbackActions = {
  registerReport: () => void;
  registerSuggestion: () => void;
  didReport: () => boolean;
  didSuggest: () => boolean;
};

export type useFeedbackProps = useFeedbackState & useFeedbackActions;

const isWithinOneDay = (timestamp: number | null): boolean => {
  if (!timestamp) return false;
  return Date.now() - timestamp < ONE_DAY_MS;
};

export const useFeedback = create<useFeedbackProps>()(
  persist(
    (set, get) => ({
      lastReport: null,
      lastSuggestion: null,
      registerReport: () => set({ lastReport: Date.now() }),
      registerSuggestion: () => set({ lastSuggestion: Date.now() }),
      didReport: () => isWithinOneDay(get().lastReport),
      didSuggest: () => isWithinOneDay(get().lastSuggestion),
    }),
    {
      name: STORAGE_ID,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
