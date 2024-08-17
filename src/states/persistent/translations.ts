import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";

const translations = [
  "Tap on the middle circle to test the color",
  "Source Color",
  "Cancel",
  "Use System",
  "Save",
  "Layout",
  "Opacity",
  "Update Me v$1 is available!",
  "Download manually",
  "Update",
  "Submit",
  "Color Scheme",
  "System",
  "Light",
  "Dark",
  "Revert",
  "UpdateMe Download Link",
  "Share",
  "Share the download link",
  "Done",
  "Downloads",
  "View your downloads",
  "Updates",
  "Check for updates",
  "Tips",
  "Maximize your experience",
  "Settings",
  "Change the app settings",
  "Suggest",
  "Suggest a new app",
  "Report",
  "Report a problem with the app",
  "Share the app with friends",
  "Time to Update You!",
  "Update Me has a new version available",
  "Update Available",
  "Updates Available",
  "Update available for $1",
  "Updates Available for $1 and $2",
  "New Release",
  "Notifications for new releases",
  "App Updates",
  "Notifications for app updates",
  "Suggest an App",
  "Features",
  "Potentially unsafe apk",
  'The VirusTotal analysis of this apk reported potential risks. To install it, enable the "$1" setting in the settings page.',
  "Risk Taker",
  "Go to settings",
  "$1 was added to the downloads",
  "$1 finished downloading",
  "Install",
  "Local Version",
  "Not installed",
  "Available Version",
  "Installed",
  "Update",
  "Open",
] as const;

export const interpolate = (template: string, ...values: string[]): string =>
  template.replace(/\$(\d+)/g, (match, index) => values[+index - 1] ?? match);

type Translation = (typeof translations)[number];

const defaultTranslations = Object.fromEntries(
  translations.map((translation) => [translation, translation])
) as Record<Translation, string>;

const storage = new MMKV({ id: "translations" });

const zustandStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? name,
  removeItem: (name) => storage.delete(name),
};
type useTranslationsProps = Record<keyof typeof defaultTranslations, string>;

export const useTranslations = create<useTranslationsProps>()(
  persist(
    (set, get) => ({
      ...defaultTranslations,
    }),
    {
      name: "translations",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
