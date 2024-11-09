import * as React from 'react';
import {List} from 'react-native-paper';
import {SectionComponentDataInferred} from '../data';
import SettingsItem from './SettingsItem';
import {ScrollView} from 'react-native';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface SettingsSectionProps {
  section: SectionComponentDataInferred;
  scrollViewRef: React.RefObject<ScrollView>;
}

const SettingsSection = ({section, scrollViewRef}: SettingsSectionProps) => {
  return (
    <List.Section title={section.title}>
      {section.items.map(item => (
        <SettingsItem
          key={item.key}
          data={item}
          scrollViewRef={scrollViewRef}
        />
      ))}
    </List.Section>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default SettingsSection;
