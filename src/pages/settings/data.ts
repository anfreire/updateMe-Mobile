import {MultiIconType} from '@/components/multiIcon';
import {Dialog} from '@/states/runtime/dialogs';
import {
  SettingsSection,
  SettingsSectionItem,
  SettingsSectionItemValue,
} from '@/types/settings';
import {Translation} from '@/types/translations';

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
  title: 'Dusk till Dawn',
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
  description: 'Delete all downloads when leaving the app',
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

/*******************************************************************************
 *                                    Layout                                   *
 *******************************************************************************/

const HomeStyle: ItemComponentData<'layout'> = {
  key: 'homeStyle',
  title: 'Feels like home',
  description: 'Change the layout of the home screen',
  icon: {
    type: 'feather',
    name: 'layout',
  },
  action: {
    type: 'dialog',
    data: 'homeLayoutPicker',
  },
};

export const LayoutSection: SectionComponentData<'layout'> = {
  title: 'Layout',
  key: 'layout',
  items: [HomeStyle],
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
  LayoutSection,
  NotificationsSection,
  DownloadsSection,
  SecuritySection,
];
