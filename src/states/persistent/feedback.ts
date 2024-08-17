import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";

const ONE_DAY_MS = 86400000 as const;

export interface useFeedbackProps {
  lastReport: number | null;
  lastSuggestion: number | null;
  registerReport: () => void;
  registerSuggestion: () => void;
  didReport: () => boolean;
  didSuggest: () => boolean;
}

const storage = new MMKV({ id: "feedback" });

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};

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
      name: "feedback",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
