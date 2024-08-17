import { create } from "zustand";
import { AppProps, IndexProps } from "@/states/temporary/index";
import { Logger } from "../persistent/logs";

export interface CurrAppProps extends AppProps {
  name: string;
  version: string | null;
  defaultProvider: string;
}

interface StoresProps {
  index: IndexProps;
  versions: Record<string, string | null>;
  defaultProviders: Record<string, string>;
}

export interface useCurrAppProps {
  currApp: CurrAppProps | null;
  setCurrApp: (appName: string, storesProps: StoresProps) => void;
  clearCurrApp: () => void;
  refresh: ({ index, defaultProviders, versions }: StoresProps) => void;
}

const createCurrApp = (
  appName: string,
  { index, versions, defaultProviders }: StoresProps
): CurrAppProps | null => {
  if (!(appName in index)) {
    Logger.error(`App "${appName}" not found in index`);
    return null;
  }
  const defaultProvider =
    defaultProviders[appName] || Object.keys(index[appName].providers)[0];
  return {
    ...index[appName],
    name: appName,
    version: versions[appName] ?? null,
    defaultProvider,
  };
};

export const useCurrApp = create<useCurrAppProps>((set, get) => ({
  currApp: null,
  setCurrApp: (appName, storesProps) => {
    const newCurrApp = createCurrApp(appName, storesProps);
    if (
      newCurrApp &&
      JSON.stringify(get().currApp) !== JSON.stringify(newCurrApp)
    ) {
      set({ currApp: newCurrApp });
    }
  },
  clearCurrApp: () => {
    set({ currApp: null });
  },
  refresh: ({ index, defaultProviders, versions }) => {
    const currApp = get().currApp;
    if (currApp === null) return;
    const newCurrApp = createCurrApp(currApp.name, {
      index,
      defaultProviders,
      versions,
    });
    if (newCurrApp && JSON.stringify(currApp) !== JSON.stringify(newCurrApp)) {
      set({ currApp: newCurrApp });
    }
  },
}));
