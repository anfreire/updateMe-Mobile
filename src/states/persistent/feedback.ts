import {StateStorage, createJSONStorage, persist} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';
import {create} from 'zustand';

export interface FeedbackProps {
  lastReport: Date | null;
  lastSuggestion: Date | null;
}

const storage = new MMKV({id: 'feedback'});

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, JSON.stringify(value));
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ? JSON.parse(value) : null;
  },
  removeItem: name => {
    return storage.delete(name);
  },
};

export interface useFeedbackProps {
  lastReport: Date | null;
  lastSuggestion: Date | null;
  registerReport: () => void;
  registerSuggestion: () => void;
  didReport: () => boolean;
  didSuggest: () => boolean;
}

export const useFeedback = create<useFeedbackProps>()(
  persist(
    (set, get) => ({
      lastReport: null,
      lastSuggestion: null,
      registerReport: () => {
        set({lastReport: new Date()});
      },
      registerSuggestion: () => {
        set({lastSuggestion: new Date()});
      },
      didReport: () => {
        const lastReport = get().lastReport;
        if (!lastReport) return false;
        const now = new Date();
        const lastReportDate = new Date(lastReport);
        const diff = now.getTime() - lastReportDate.getTime();
        return diff < 24 * 60 * 60 * 1000;
      },
      didSuggest: () => {
        const lastSuggestion = get().lastSuggestion;
        if (!lastSuggestion) return false;
        const now = new Date();
        const lastSuggestionDate = new Date(lastSuggestion);
        const diff = now.getTime() - lastSuggestionDate.getTime();
        return diff < 24 * 60 * 60 * 1000;
      },
    }),
    {
      name: 'feedback',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
