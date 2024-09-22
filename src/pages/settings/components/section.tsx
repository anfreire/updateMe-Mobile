import * as React from 'react';
import {SectionComponentDataInferred} from '../data';
import {List} from 'react-native-paper';
import {useTranslations} from '@/states/persistent/translations';
import DialogSettingsItem from './dialogItem';
import CheckboxSettingsItem from './checkboxItem';

interface SettingsSectionProps {
  item: SectionComponentDataInferred;
}

const SettingsSection = ({item: section}: SettingsSectionProps) => {
  const title = useTranslations(state => state.translations[section.title]);

  return (
    <List.Section title={title}>
      {section.items.map(item =>
        item.action.type === 'dialog' ? (
          <DialogSettingsItem key={item.title} data={item} />
        ) : (
          <CheckboxSettingsItem key={item.title} data={item} />
        ),
      )}
    </List.Section>
  );
};

export default SettingsSection;
