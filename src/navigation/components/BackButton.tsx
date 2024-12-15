import React, {memo, useCallback} from 'react';
import {simulateBackPress} from '@/lib/system';
import {StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
import Animated, {FadeInLeft, FadeOutLeft} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../types';

const AnimatedIconButton = Animated.createAnimatedComponent(IconButton);

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/
function useOnPress() {
  const {setParams} = useNavigation<MainStackNavigation>();

  return useCallback(() => {
    setParams(undefined);
    simulateBackPress();
  }, [setParams]);
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const BackButton = () => {
  const onPress = useOnPress();

  return (
    <AnimatedIconButton
      icon="arrow-left"
      onPress={onPress}
      style={styles.iconButton}
      entering={FadeInLeft.duration(300).springify()}
      exiting={FadeOutLeft.duration(300).springify()}
    />
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/
const styles = StyleSheet.create({
  iconButton: {
    margin: 0,
    zIndex: 1,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(BackButton);
