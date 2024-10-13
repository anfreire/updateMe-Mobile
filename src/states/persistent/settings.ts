import {StateStorage, createJSONStorage, persist} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';
import {create} from 'zustand';
import {
  DEFAULT_SETTINGS,
  Settings,
  SettingsSection,
  SettingsSectionItem,
  SettingsSectionItemValue,
} from '@/types/settings';
import {deepEqual} from 'fast-equals';

const STORAGE_ID = 'settings' as const;

const storage = new MMKV({id: STORAGE_ID});

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: name => storage.getString(name) ?? null,
  removeItem: name => storage.delete(name),
};

type useSettingsState = {
  settings: Settings;
};

type useSettingsActions = {
  setSetting: <T extends SettingsSection, K extends SettingsSectionItem<T>>(
    key: T,
    item: K,
    value: SettingsSectionItemValue<T, K>,
  ) => void;
  resetSetting: <T extends SettingsSection, K extends SettingsSectionItem<T>>(
    key: T,
    item: K,
  ) => void;
};

export type useSettingsProps = useSettingsState & useSettingsActions;

export const useSettings = create<useSettingsProps>()(
  persist(
    set => ({
      settings: DEFAULT_SETTINGS,
      setSetting: <T extends SettingsSection, K extends SettingsSectionItem<T>>(
        key: T,
        item: K,
        value: SettingsSectionItemValue<T, K>,
      ) => {
        set(state => {
          const newSettings = {
            ...state.settings,
            [key]: {...state.settings[key], [item]: value},
          };
          return deepEqual(state.settings, newSettings)
            ? state
            : {settings: newSettings};
        });
      },
      resetSetting: <
        T extends SettingsSection,
        K extends SettingsSectionItem<T>,
      >(
        key: T,
        item: K,
      ) => {
        set(state => {
          const newSettings = {
            ...state.settings,
            [key]: {
              ...DEFAULT_SETTINGS[key],
              [item]: DEFAULT_SETTINGS[key][item],
            },
          };
          return isEqual(state.settings, newSettings)
            ? state
            : {settings: newSettings};
        });
      },
    }),
    {
      name: STORAGE_ID,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
