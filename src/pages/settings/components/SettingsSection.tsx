import * as React from 'react';
import {List} from 'react-native-paper';
import {SectionComponentDataInferred} from '../data';
import SettingsItem from './SettingsItem';

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

interface SettingsSectionProps {
  item: SectionComponentDataInferred;
}

const SettingsSection = ({item: section}: SettingsSectionProps) => {
  return (
    <List.Section title={section.title}>
      {section.items.map(item => (
        <SettingsItem key={item.key} data={item} />
      ))}
    </List.Section>
  );
};

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default SettingsSection;
