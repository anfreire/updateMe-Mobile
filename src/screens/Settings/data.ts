import {useMultiIconProps} from '@/common/components/MultiIcon';
import {SettingsStackPage} from '@/navigation/types';
import {
  SettingsSection,
  SettingsSectionItem,
} from '@/stores/persistent/settings';
import {Translation} from '@/stores/persistent/translations';
import {Dialog} from '@/stores/runtime/dialogs';

/******************************************************************************
 *                                TYPES - ITEM                                *
 ******************************************************************************/

interface SettingsScreenItemBase<T extends SettingsSection = SettingsSection> {
  title: Translation;
  description: Translation;
  icon: useMultiIconProps;
  section: T;
  item: SettingsSectionItem<T>;
}

export interface SettingsScreenItemCheckbox<
  T extends SettingsSection = SettingsSection,
> extends SettingsScreenItemBase<T> {
  type: 'checkbox';
}

export interface SettingsScreenItemDialog<
  T extends SettingsSection = SettingsSection,
> extends SettingsScreenItemBase<T> {
  type: 'dialog';
  data: Dialog;
}

export interface SettingsScreenItemScreen<
  T extends SettingsSection = SettingsSection,
> extends SettingsScreenItemBase<T> {
  type: 'screen';
  data: SettingsStackPage;
}

export type SettingsScreenItem =
  | SettingsScreenItemCheckbox
  | SettingsScreenItemDialog
  | SettingsScreenItemScreen;

/******************************************************************************
 *                              TYPES - SECTION                               *
 ******************************************************************************/

export type SettingsScreenSection = {
  title: Translation;
  items: SettingsScreenItem[];
};

/******************************************************************************
 *                             APPEARANCE - ITEMS                             *
 ******************************************************************************/

const SourceColor: SettingsScreenItemDialog<'appearance'> = {
  title: 'Source Color',
  description: 'Change the source color',
  icon: {
    name: 'palette',
  },
  section: 'appearance',
  item: 'sourceColor',
  type: 'dialog',
  data: 'sourceColor',
} as const;

const ColorScheme: SettingsScreenItemDialog<'appearance'> = {
  title: 'Color Scheme',
  description: 'Change the color scheme',
  icon: {
    name: 'theme-light-dark',
  },
  section: 'appearance',
  item: 'colorScheme',
  type: 'dialog',
  data: 'colorScheme',
} as const;

/******************************************************************************
 *                            APPEARANCE - SECTION                            *
 ******************************************************************************/

const AppearanceSection: SettingsScreenSection = {
  title: 'Appearance',
  items: [SourceColor, ColorScheme],
} as const;

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export const SettingsScreenSections: SettingsScreenSection[] = [
  AppearanceSection,
] as const;
