import React, {memo} from 'react';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';
import {useScrollTo} from '@/common/hooks/useScrollTo';
import {SettingsScreenSection, SettingsScreenSections} from './data';
import SettingsSection from './components/SettingsSection';
import {Page} from '@/navigation/types';
import {ScrollView} from 'react-native';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'settings';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const SettingsScreen = () => {
  const {scrollViewRef, scrollToItem} = useScrollTo();

  useCurrPageEffect(CURR_PAGE);

  return (
    <ScrollView ref={scrollViewRef}>
      {SettingsScreenSections.map((section: SettingsScreenSection) => (
        <SettingsSection
          key={section.title}
          section={section}
          scrollToItem={scrollToItem}
        />
      ))}
    </ScrollView>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(SettingsScreen);
