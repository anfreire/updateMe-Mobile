import React, {memo} from 'react';
import {List} from 'react-native-paper';
import {View} from 'react-native';
import {SettingsScreenSection} from '../data';
import {useTranslations} from '@/stores/persistent/translations';
import {SettingsScreenProps} from '..';
import SettingsItem from './SettingsItem';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface SettingsSectionProps extends SettingsScreenProps {
  section: SettingsScreenSection;
  scrollToItem: (itemRef: React.RefObject<View>) => void;
}

const SettingsSection = ({
  section,
  scrollToItem,
  navigation,
  route,
}: SettingsSectionProps) => {
  const translations = useTranslations(state => state.translations);

  return (
    <List.Section title={translations[section.title]}>
      {section.items.map(item => (
        <SettingsItem
          key={item.title}
          item={item}
          scrollToItem={scrollToItem}
          navigation={navigation}
          route={route}
        />
      ))}
    </List.Section>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(SettingsSection);
