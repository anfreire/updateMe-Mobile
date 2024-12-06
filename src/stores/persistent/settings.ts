import {createJSONStorage, persist} from 'zustand/middleware';
import {create} from 'zustand';
import {deepEqual} from 'fast-equals';
import {buildPersistentStorage, migrate} from '../utils';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const STORAGE_ID = 'settings' as const;

const PERSISTED_KEYS: Array<keyof useSettingsState> = ['settings'];

const DEFAULT_STATE: Settings = {
  appearance: {
    sourceColor: undefined,
    colorScheme: 'system',
  },
};

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export interface Settings {
  appearance: {
    sourceColor: string | undefined;
    colorScheme: 'system' | 'light' | 'dark';
  };
}

export type SettingsSection = keyof Settings;

export type SettingsSectionItem<T extends SettingsSection> = Exclude<
  {
    [K in keyof Settings[T]]: K;
  }[keyof Settings[T]],
  undefined
>;

export type SettingsSectionItemInferred = {
  [K in SettingsSection]: SettingsSectionItem<K>;
}[SettingsSection];

export type SettingsSectionItemValue<
  T extends SettingsSection,
  K extends SettingsSectionItem<T>,
> = {
  [P in T]: {
    [Q in K]: Settings[P][Q];
  };
}[T][K];

/******************************************************************************
 *                                   STORE                                    *
 ******************************************************************************/

type useSettingsState = {
  settings: Settings;
};

type useSettingsActions = {
  setSetting: <T extends SettingsSection, K extends SettingsSectionItem<T>>(
    key: T,
    item: K,
    value: SettingsSectionItemValue<T, K>,
  ) => void;
  setSettingWithPrevious: <
    T extends SettingsSection,
    K extends SettingsSectionItem<T>,
  >(
    key: T,
    item: K,
    callback: (
      prev: SettingsSectionItemValue<T, K>,
    ) => SettingsSectionItemValue<T, K>,
  ) => void;
  resetSetting: <T extends SettingsSection, K extends SettingsSectionItem<T>>(
    key: T,
    item: K,
  ) => void;
};

export type useSettingsProps = useSettingsState & useSettingsActions;

const zustandStorage = buildPersistentStorage(STORAGE_ID);

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

export const useSettings = create<useSettingsProps>()(
  persist(
    set => ({
      settings: DEFAULT_STATE,
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
      setSettingWithPrevious: <
        T extends SettingsSection,
        K extends SettingsSectionItem<T>,
      >(
        key: T,
        item: K,
        callback: (
          prev: SettingsSectionItemValue<T, K>,
        ) => SettingsSectionItemValue<T, K>,
      ) => {
        set(state => {
          const newSettings = {
            ...state.settings,
            [key]: {
              ...state.settings[key],
              [item]: callback(
                state.settings[key]?.[item] ?? DEFAULT_STATE[key][item],
              ),
            },
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
              ...DEFAULT_STATE[key],
              [item]: DEFAULT_STATE[key][item],
            },
          };
          return deepEqual(state.settings, newSettings)
            ? state
            : {settings: newSettings};
        });
      },
    }),
    {
      name: STORAGE_ID,
      storage: createJSONStorage(() => zustandStorage),
      migrate: (persistedState, version) =>
        migrate(
          DEFAULT_STATE as unknown as Record<string, unknown>,
          persistedState,
          version,
        ),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            PERSISTED_KEYS.includes(key as keyof useSettingsState),
          ),
        ),
    },
  ),
);
