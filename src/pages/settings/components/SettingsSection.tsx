import * as React from 'react';
import {List} from 'react-native-paper';
import {SectionComponentDataInferred} from '../data';
import SettingsItem from './SettingsItem';
import {View} from 'react-native';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface SettingsSectionProps {
  section: SectionComponentDataInferred;
  scrollToItem: (itemRef: React.RefObject<View>) => void;
}

const SettingsSection = ({section, scrollToItem}: SettingsSectionProps) => {
  return (
    <List.Section title={section.title}>
      {section.items.map(item => (
        <SettingsItem key={item.key} data={item} scrollToItem={scrollToItem} />
      ))}
    </List.Section>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default SettingsSection;
