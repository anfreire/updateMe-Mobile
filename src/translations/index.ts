import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {MMKV} from 'react-native-mmkv';
import HttpBackend from 'i18next-http-backend';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const STORAGE_KEY = 'translations';

const TRANSLATIONS = [
  'Home',
  'Settings',
  'Downloads',
  'Updates',
  'Share',
  'Report',
  'Providers',
];

const DEFAULT_TRANSLATIONS = {
  en: {
    translation: Object.fromEntries(
      TRANSLATIONS.map(translation => [translation, translation]),
    ),
  },
};

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type Translation = (typeof TRANSLATIONS)[number];

/******************************************************************************
 *                                   STORE                                    *
 ******************************************************************************/

const storage = new MMKV({id: STORAGE_KEY});

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

export function initTranslations() {
  i18next
    .use(initReactI18next)
    .use(HttpBackend)
    .init({
      resources: DEFAULT_TRANSLATIONS,
      fallbackLng: 'en',
      lng: storage.getString('language') || 'en',

      // backend: {
      //   loadPath: 'https://raw.githubusercontent.com/your-repo/{{lng}}.json',
      //   loadBefore: lng => lng !== 'en',
      // },

      interpolation: {
        escapeValue: false,
      },
    });
}
