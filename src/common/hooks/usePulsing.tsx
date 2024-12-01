import * as React from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const OPACITY_START = 1;
const OPACITY_END = 0.5;

const TIMING_CONFIG = {
  duration: 600,
  easing: Easing.inOut(Easing.quad),
} as const;

const REPEAT_TIMES = 6;

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

export function usePulsing() {
  const opacity = useSharedValue(OPACITY_START);

  const pulsingStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const startPulsing = React.useCallback(() => {
    if (opacity.value !== OPACITY_START) {
      return;
    }
    opacity.value = withRepeat(
      withTiming(OPACITY_END, TIMING_CONFIG),
      REPEAT_TIMES,
      true,
    );
  }, []);

  const cancelPulsing = React.useCallback(() => {
    cancelAnimation(opacity);
    opacity.value = OPACITY_START;
  }, []);

  return {startPulsing, cancelPulsing, pulsingStyles};
}
