export interface Settings {
  layout: {
    homeStyle: "categories" | "list" | "grid";
  };
  theme: {
    sourceColor?: string;
    colorScheme: "system" | "light" | "dark";
  };
  notifications: {
    updatesNotification: boolean;
    newReleaseNotification: boolean;
  };
  downloads: {
    installAfterDownload: boolean;
    deleteOnLeave: boolean;
  };
  security: {
    installUnsafeApps: boolean;
  };
}

export const DEFAULT_SETTINGS: Settings = {
  layout: {
    homeStyle: "categories",
  },
  theme: {
    sourceColor: undefined,
    colorScheme: "system",
  },
  notifications: {
    updatesNotification: true,
    newReleaseNotification: true,
  },
  downloads: {
    installAfterDownload: true,
    deleteOnLeave: true,
  },
  security: {
    installUnsafeApps: false,
  },
};

export type SettingsSection = keyof Settings;

export type SettingsSectionItem<T extends SettingsSection> = keyof Settings[T];

export type SettingsSectionItemValue<T extends SettingsSection> =
  Settings[T][SettingsSectionItem<T>];

export type BooleanSettingsSection = {
  [K in keyof Settings]: Settings[K] extends { [key: string]: boolean }
    ? K
    : never;
}[keyof Settings];

export type BooleanSettingsSectionItem<T extends BooleanSettingsSection> =
  Settings[T] extends { [key: string]: boolean } ? keyof Settings[T] : never;
