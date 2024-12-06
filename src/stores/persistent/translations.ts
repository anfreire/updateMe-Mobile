import {createJSONStorage, persist} from 'zustand/middleware';
import {create} from 'zustand';
import {buildPersistentStorage, migrate} from '../utils';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const STORAGE_ID = 'translations' as const;

const PERSISTED_KEYS: Array<keyof useTranslationsState> = [
  'language',
  'translations',
];

const DEFAULT_LANGUAGE = 'en' as const;

const TRANSLATIONS = [
  'Home',
  'Share',
  'Developed by $1',
  'Report',
  'Downloads',
  'Tools',
  'Updates',
  'Providers',
  'Settings',
  'Done',
  'Share the download link',
  '$1 download link',
  'Source Color',
  'Change the source color',
  'Color Scheme',
  'Change the color scheme',
  'System',
  'Light',
  'Dark',
  'Appearance',
  'Revert',
  'Save',
  'File Analysis',
  'File Fingerprint',
  'App',
  'Provider',
  'Tap on the middle circle to test the color',
  'Use System',
  'Scan files with VirusTotal for threats',
  'Generate the SHA-256 hash of a file',
  'Build and test new providers',
  'Provider Studio',
  'Help',
] as const;

const DEFAULT_TRANSLATIONS: Record<Translation, string> = Object.fromEntries(
  TRANSLATIONS.map(translation => [translation, translation]),
) as Record<Translation, string>;

const DEFAULT_STATE = {
  language: DEFAULT_LANGUAGE,
  translations: DEFAULT_TRANSLATIONS,
};

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type Translation = (typeof TRANSLATIONS)[number];

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

export const interpolate = (template: string, ...values: string[]): string =>
  template.replace(/\$(\d+)/g, (match, index) => values[+index - 1] ?? match);

/******************************************************************************
 *                                   STORE                                    *
 ******************************************************************************/

const zustandStorage = buildPersistentStorage(STORAGE_ID);

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
