import React, {memo} from 'react';
import {Page, PageProps} from '@/navigation';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';
import {useScrollTo} from '@/common/hooks/useScrollTo';
import {SettingsScreenSection, SettingsScreenSections} from './data';
import Animated from 'react-native-reanimated';
import SettingsSection from './components/SettingsSection';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'settings';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

export type SettingsScreenProps = PageProps<typeof CURR_PAGE>;

const SettingsScreen = ({navigation, route}: SettingsScreenProps) => {
  const {scrollViewRef, scrollToItem} = useScrollTo();

  useCurrPageEffect(CURR_PAGE);

  return (
    <Animated.ScrollView ref={scrollViewRef} className="pt-0">
      {SettingsScreenSections.map((section: SettingsScreenSection) => (
        <SettingsSection
          key={section.title}
          section={section}
          scrollToItem={scrollToItem}
          navigation={navigation}
          route={route}
        />
      ))}
    </Animated.ScrollView>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(SettingsScreen);
