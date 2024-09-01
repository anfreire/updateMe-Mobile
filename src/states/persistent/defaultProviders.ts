import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import isEqual from "react-fast-compare";
import { Index, IndexApp } from "@/states/fetched/index";

const STORAGE_ID = "default-providers" as const;

export type DefaultProviders = Record<IndexApp, string>;

const storage = new MMKV({ id: STORAGE_ID });

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};

interface useDefaultProvidersState {
  defaultProviders: DefaultProviders;
  populatedDefaultProviders: DefaultProviders;
}

interface useDefaultProvidersActions {
  setDefaultProvider: (appName: IndexApp, provider: string) => void;
  sanitize: (index: Index) => DefaultProviders;
  populate: (index: Index) => DefaultProviders;
}

export type useDefaultProvidersProps = useDefaultProvidersState &
  useDefaultProvidersActions;

export const useDefaultProviders = create<useDefaultProvidersProps>()(
  persist(
    (set, get) => ({
      defaultProviders: {},
      populatedDefaultProviders: {},
      setDefaultProvider: (appName, provider) => {
        set((state) => {
          if (state.defaultProviders[appName] === provider) return state;
          const newState = {
            defaultProviders: {
              ...state.defaultProviders,
              [appName]: provider,
            },
            populatedDefaultProviders: {
              ...state.populatedDefaultProviders,
              [appName]: provider,
            },
          };
          return newState;
        });
      },
      sanitize: (index) => {
        const newDefaultProviders = Object.fromEntries(
          Object.entries(get().defaultProviders).filter(
            ([appName, provider]) =>
              appName in index && provider in index[appName].providers
          )
        );
        set((state) =>
          isEqual(state.defaultProviders, newDefaultProviders)
            ? state
            : { defaultProviders: newDefaultProviders }
        );
        return newDefaultProviders;
      },
      populate: (index) => {
        const newPopulatedDefaultProviders = Object.fromEntries(
          Object.entries(index).map(([appName, app]) => [
            appName,
            get().defaultProviders[appName] ?? Object.keys(app.providers)[0],
          ])
        );
        set((state) =>
          isEqual(state.populatedDefaultProviders, newPopulatedDefaultProviders)
            ? state
            : { populatedDefaultProviders: newPopulatedDefaultProviders }
        );
        return newPopulatedDefaultProviders;
      },
    }),
    {
      name: STORAGE_ID,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
