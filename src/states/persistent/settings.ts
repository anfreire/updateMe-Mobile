import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import {
  BooleanSettingsSection,
  BooleanSettingsSectionItem,
  DEFAULT_SETTINGS,
  Settings,
  SettingsSection,
  SettingsSectionItem,
  SettingsSectionItemValue,
} from "@/types/settings";
import isEqual from "react-fast-compare";

const STORAGE_ID = "settings" as const;

const storage = new MMKV({ id: STORAGE_ID });

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};

type useSettingsState = {
  settings: Settings;
};

type useSettingsActions = {
  setSetting: <T extends keyof Settings, K extends keyof Settings[T]>(
    key: T,
    item: K,
    value: Settings[T][K]
  ) => void;
  toggleSetting: <
    T extends BooleanSettingsSection,
    K extends BooleanSettingsSectionItem<T>,
  >(
    key: T,
    item: K
  ) => void;
  resetSetting: <T extends keyof Settings, K extends keyof Settings[T]>(
    key: T,
    item: K
  ) => void;
};

export type useSettingsProps = useSettingsState & useSettingsActions;

export const useSettings = create<useSettingsProps>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      setSetting: <T extends SettingsSection, K extends SettingsSectionItem<T>>(
        key: T,
        item: K,
        value: SettingsSectionItemValue<T>
      ) => {
        set((state) => {
          const newSettings = {
            ...state.settings,
            [key]: { ...state.settings[key], [item]: value },
          };
          return isEqual(state.settings, newSettings)
            ? state
            : { settings: newSettings };
        });
      },
      toggleSetting: <
        T extends BooleanSettingsSection,
        K extends BooleanSettingsSectionItem<T>,
      >(
        key: T,
        item: K
      ) => {
        set((state) => ({
          settings: {
            ...state.settings,
            [key]: {
              ...state.settings[key],
              [item]: !state.settings[key][item],
            },
          },
        }));
      },
      resetSetting: <
        T extends SettingsSection,
        K extends SettingsSectionItem<T>,
      >(
        key: T,
        item: K
      ) => {
        set((state) => {
          const newSettings = {
            ...state.settings,
            [key]: {
              ...DEFAULT_SETTINGS[key],
              [item]: DEFAULT_SETTINGS[key][item],
            },
          };
          return isEqual(state.settings, newSettings)
            ? state
            : { settings: newSettings };
        });
      },
    }),
    {
      name: STORAGE_ID,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
