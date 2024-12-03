import React, {memo} from 'react';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';
import {useScrollTo} from '@/common/hooks/useScrollTo';
import {SettingsScreenSection, SettingsScreenSections} from './data';
import Animated from 'react-native-reanimated';
import SettingsSection from './components/SettingsSection';
import {Page} from '@/navigation/types';
import {StyleSheet, View} from 'react-native';

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
    <Animated.ScrollView ref={scrollViewRef} style={styles.scrollView}>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{height: 1000}}
      />
      {SettingsScreenSections.map((section: SettingsScreenSection) => (
        <SettingsSection
          key={section.title}
          section={section}
          scrollToItem={scrollToItem}
        />
      ))}
    </Animated.ScrollView>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 0,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(SettingsScreen);
