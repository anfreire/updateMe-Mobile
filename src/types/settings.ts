export interface Settings {
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
  apps: {
    ignoredApps: string[];
  };
  providers: {
    defaultProviders: Record<string, string>;
    providersOrder: string[];
  };
  security: {
    installUnsafeApps: boolean;
  };
}

export const DEFAULT_SETTINGS: Settings = {
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
  apps: {
    ignoredApps: [],
  },
  providers: {
    defaultProviders: {},
    providersOrder: [],
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
