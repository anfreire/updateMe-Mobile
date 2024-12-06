import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../types';
import Animated, {FadeInLeft, FadeOutLeft} from 'react-native-reanimated';
import {useSession} from '@/stores/runtime/session';
import {simulateBackPress} from '@/lib/system';

const AnimatedIconButton = Animated.createAnimatedComponent(IconButton);

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const HeaderLeft = () => {
  const currPage = useSession(state => state.currPage);
  const {openDrawer, canGoBack} = useNavigation<MainStackNavigation>();

  const showBackButton = canGoBack() && currPage !== 'home';

  return (
    <Animated.View style={styles.wrapper}>
      <AnimatedIconButton
        icon="menu"
        onPress={openDrawer}
        style={styles.iconButton}
      />
      {showBackButton && (
        <AnimatedIconButton
          icon="arrow-left"
          onPress={simulateBackPress}
          style={styles.iconButton}
          entering={FadeInLeft.duration(300).springify()}
          exiting={FadeOutLeft.duration(300).springify()}
        />
      )}
    </Animated.View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 0,
    marginLeft: 4,
  },
  iconButton: {
    margin: 0,
    zIndex: 1,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default HeaderLeft;
