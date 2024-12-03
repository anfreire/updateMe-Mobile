import React, {memo} from 'react';
import {List} from 'react-native-paper';
import {View} from 'react-native';
import {useTranslations} from '@/stores/persistent/translations';
import SettingsItem from './SettingsItem';
import {SettingsScreenSection} from '../data';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface SettingsSectionProps {
  section: SettingsScreenSection;
  scrollToItem: (itemRef: React.RefObject<View>) => void;
}

const SettingsSection = ({section, scrollToItem}: SettingsSectionProps) => {
  const translations = useTranslations(state => state.translations);

  return (
    <List.Section title={translations[section.title]}>
      {section.items.map(item => (
        <SettingsItem
          key={item.title}
          item={item}
          scrollToItem={scrollToItem}
        />
      ))}
    </List.Section>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(SettingsSection);
