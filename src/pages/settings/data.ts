import {MultiIconType} from '@/components/MultiIcon';
import {Dialog} from '@/states/runtime/dialogs';
import {
  SettingsSection,
  SettingsSectionItem,
  SettingsSectionItemValue,
} from '@/types/settings';
import {Translation} from '@/types/translations';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type ItemActionData<
  Section extends SettingsSection,
  Item extends SettingsSectionItem<Section>,
> =
  SettingsSectionItemValue<Section, Item> extends boolean
    ? {type: 'checkbox'; data: Section}
    : {type: 'dialog'; data: Dialog};

export type ItemComponentData<
  Section extends SettingsSection,
  Item extends SettingsSectionItem<Section> = SettingsSectionItem<Section>,
> = {
  key: Item;
  title: Translation;
  description: Translation;
  icon: {
    type: MultiIconType;
    name: string;
  };
  action: ItemActionData<Section, Item>;
};

export type ItemComponentDataInferred = {
  [K in SettingsSection]: ItemComponentData<K>;
}[SettingsSection];

export type SectionComponentData<Section extends SettingsSection> = {
  title: Translation;
  key: Section;
  items: ItemComponentData<Section>[];
};

export type SectionComponentDataInferred = {
  [K in SettingsSection]: SectionComponentData<K>;
}[SettingsSection];

/*******************************************************************************
 *                                  Appearance                                 *
 *******************************************************************************/
const SourceColor: ItemComponentData<'appearance'> = {
  key: 'sourceColor',
  title: 'Chromatic Shift',
  icon: {
    type: 'material-icons',
    name: 'palette',
  },
  description: 'Change the source color of the app',
  action: {
    type: 'dialog',
    data: 'sourceColorPicker',
  },
};

const ColorScheme: ItemComponentData<'appearance'> = {
  key: 'colorScheme',
  title: 'Dusk Till Dawn',
  description: 'Change the color scheme of the app',
  icon: {
    type: 'material-community',
    name: 'theme-light-dark',
  },
  action: {
    type: 'dialog',
    data: 'colorSchemePicker',
  },
};

export const AppearanceSection: SectionComponentData<'appearance'> = {
  title: 'Appearance',
  key: 'appearance',
  items: [SourceColor, ColorScheme],
};

/*******************************************************************************
 *                                  Downloads                                  *
 *******************************************************************************/

const InstallAfterDownload: ItemComponentData<'downloads'> = {
  key: 'installAfterDownload',
  title: 'Install Express',
  description: 'Install the app after downloading',
  icon: {
    type: 'material-icons',
    name: 'install-mobile',
  },
  action: {type: 'checkbox', data: 'downloads'},
};

const DeleteOnLeave: ItemComponentData<'downloads'> = {
  key: 'deleteOnLeave',
  title: 'Fresh Start',
  description: 'Deletes all downloads when leaving the app',
  icon: {
    type: 'material-icons',
    name: 'delete-sweep',
  },
  action: {type: 'checkbox', data: 'downloads'},
};

export const DownloadsSection: SectionComponentData<'downloads'> = {
  title: 'Downloads',
  key: 'downloads',
  items: [InstallAfterDownload, DeleteOnLeave],
};

/******************************************************************************
 *                                    Apps                                    *
 ******************************************************************************/

const IgnoredApps: ItemComponentData<'apps'> = {
  key: 'ignoredApps',
  title: 'Update Dodger',
  description: 'Select apps to exclude from updates',
  icon: {
    type: 'material-icons',
    name: 'update-disabled',
  },
  action: {type: 'dialog', data: 'ignoredApps'},
};

const AppsSection: SectionComponentData<'apps'> = {
  title: 'Apps',
  key: 'apps',
  items: [IgnoredApps],
};

/******************************************************************************
 *                                 Providers                                  *
 ******************************************************************************/

const ProvidersOrder: ItemComponentData<'providers'> = {
  key: 'providersOrder',
  title: 'Sort It Out',
  description: 'Change the order of the providers',
  icon: {
    type: 'material-community',
    name: 'sort',
  },
  action: {type: 'dialog', data: 'providersOrder'},
};

const ProvidersSection: SectionComponentData<'providers'> = {
  title: 'Providers',
  key: 'providers',
  items: [ProvidersOrder],
};

/*******************************************************************************
 *                                Notifications                                *
 *******************************************************************************/

const UpdatesNotification: ItemComponentData<'notifications'> = {
  key: 'updatesNotification',
  title: 'Update Junkie',
  description: 'Get notified when there are installed apps updates',
  icon: {
    type: 'material-icons',
    name: 'update',
  },
  action: {type: 'checkbox', data: 'notifications'},
};

const NewReleaseNotification: ItemComponentData<'notifications'> = {
  key: 'newReleaseNotification',
  title: 'Frontline Fan',
  description: 'Get notified when there is a new UpdateMe release',
  icon: {
    type: 'material-icons',
    name: 'new-releases',
  },
  action: {type: 'checkbox', data: 'notifications'},
};

export const NotificationsSection: SectionComponentData<'notifications'> = {
  title: 'Notifications',
  key: 'notifications',
  items: [UpdatesNotification, NewReleaseNotification],
};

/*******************************************************************************
 *                                   Security                                  *
 *******************************************************************************/

const InstallUnsafeApps: ItemComponentData<'security'> = {
  key: 'installUnsafeApps',
  title: 'Risk Taker',
  description: 'Install potentially unsafe apps',
  icon: {
    type: 'material-community',
    name: 'shield-off',
  },
  action: {type: 'checkbox', data: 'security'},
};

const SecuritySection: SectionComponentData<'security'> = {
  title: 'Security',
  key: 'security',
  items: [InstallUnsafeApps],
};

/*******************************************************************************
 *                                     ALL                                     *
 *******************************************************************************/

export const SectionsData: SectionComponentDataInferred[] = [
  AppearanceSection,
  AppsSection,
  ProvidersSection,
  NotificationsSection,
  DownloadsSection,
  SecuritySection,
];
