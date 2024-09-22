export type HomeLayout = 'categories' | 'list' | 'grid';

export interface Settings {
  layout: {
    homeStyle: HomeLayout;
  };
  appearance: {
    sourceColor?: string;
    colorScheme: 'system' | 'light' | 'dark';
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
    homeStyle: 'categories',
  },
  appearance: {
    sourceColor: undefined,
    colorScheme: 'system',
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

export type SettingsSectionItem<T extends SettingsSection> = {
  [K in keyof Settings[T]]: K;
}[keyof Settings[T]];

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
