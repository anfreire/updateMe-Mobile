import * as React from 'react';
import {Page} from '@/types/navigation';
import {useCurrPageEffect} from '@/hooks/useCurrPageEffect';
import {SectionsData} from './data';
import {FlashList} from '@shopify/flash-list';
import SettingsSection from './components/section';

const CURR_PAGE: Page = 'settings';

const SettingsScreen: React.FC = React.memo(() => {
  useCurrPageEffect(CURR_PAGE);

  return (
    <FlashList
      data={SectionsData}
      renderItem={SettingsSection}
      estimatedItemSize={SectionsData.length}
      keyExtractor={item => item.title}
    />
  );
});

SettingsScreen.displayName = 'SettingsScreen';

export default SettingsScreen;
