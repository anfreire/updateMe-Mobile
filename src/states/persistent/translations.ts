import {StateStorage, createJSONStorage, persist} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';
import {create} from 'zustand';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_TRANSLATIONS,
  Translation,
} from '@/types/translations';
import {migrate} from '../utils';

const STORAGE_ID = 'translations' as const;

const PERSISTED_KEYS: Array<keyof useTranslationsState> = [
  'language',
  'translations',
];

const DEFAULT_STATE = {
  language: DEFAULT_LANGUAGE,
  translations: DEFAULT_TRANSLATIONS,
};

export const interpolate = (template: string, ...values: string[]): string =>
  template.replace(/\$(\d+)/g, (match, index) => values[+index - 1] ?? match);

const storage = new MMKV({id: STORAGE_ID});

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: name => storage.getString(name) ?? name,
  removeItem: name => storage.delete(name),
};

type useTranslationsState = {
  language: string;
  translations: Record<Translation, string>;
};

type useTranslationsActions = {
  resetTranslations: () => void;
  setTranslations: (
    language: string,
    translations: Record<Translation, string>,
  ) => void;
};

export type useTranslationsProps = useTranslationsState &
  useTranslationsActions;

export const useTranslations = create<useTranslationsProps>()(
  persist(
    set => ({
      language: DEFAULT_LANGUAGE,
      translations: DEFAULT_TRANSLATIONS,
      resetTranslations: () => {
        set(state => {
          return state.language === DEFAULT_LANGUAGE
            ? state
            : {
                language: DEFAULT_LANGUAGE,
                translations: DEFAULT_TRANSLATIONS,
              };
        });
      },
      setTranslations: (language, translations) => {
        set(state => {
          return state.language === language ? state : {language, translations};
        });
      },
    }),
    {
      name: STORAGE_ID,
      storage: createJSONStorage(() => zustandStorage),
      migrate: (persistedState, version) =>
        migrate(DEFAULT_STATE, persistedState, version),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            PERSISTED_KEYS.includes(key as keyof useTranslationsState),
          ),
        ),
    },
  ),
);
