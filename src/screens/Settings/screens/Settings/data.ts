import {MultiIconType} from '@/common/components/MultiIcon';
import {SettingsStackPage} from '@/navigation';
import {
  SettingsSection,
  SettingsSectionItem,
  SettingsSectionItemValue,
} from '@/stores/persistent/settings';
import {Translation} from '@/stores/persistent/translations';
import {Dialog} from '@/stores/runtime/dialogs';

/******************************************************************************
 *                                TYPES - ITEM                                *
 ******************************************************************************/

interface SettingsScreenItemBase {
  title: Translation;
  description: Translation;
  icon: {
    name: string;
    type?: MultiIconType;
  };
}

export interface SettingsScreenItemCheckbox<
  T extends SettingsSection = SettingsSection,
> extends SettingsScreenItemBase {
  type: 'checkbox';
  data: {
    section: T;
    item: SettingsSectionItem<T>;
  };
}

export interface SettingsScreenItemSelect<
  T extends SettingsSection = SettingsSection,
  V extends SettingsSectionItem<T> = SettingsSectionItem<T>,
> extends SettingsScreenItemBase {
  type: 'select';
  data: {
    section: T;
    item: SettingsSectionItem<T>;
    values: Partial<Record<Translation, SettingsSectionItemValue<T, V>>>;
  };
}

export interface SettingsScreenItemDialog extends SettingsScreenItemBase {
  type: 'dialog';
  data: Dialog;
}

export interface SettingsScreenItemScreen extends SettingsScreenItemBase {
  type: 'screen';
  data: SettingsStackPage;
}

export type SettingsScreenItem =
  | SettingsScreenItemCheckbox
  | SettingsScreenItemSelect
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

const SourceColor: SettingsScreenItemScreen = {
  title: 'Source Color',
  description: 'Change the source color',
  icon: {
    name: 'palette',
  },
  type: 'screen',
  data: 'sourceColor',
} as const;

const ColorScheme: SettingsScreenItemSelect<'appearance', 'colorScheme'> = {
  title: 'Color Scheme',
  description: 'Change the color scheme',
  icon: {
    name: 'theme-light-dark',
  },
  type: 'select',
  data: {
    section: 'appearance',
    item: 'colorScheme',
    values: {
      System: 'system',
      Light: 'light',
      Dark: 'dark',
    },
  },
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
