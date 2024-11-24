import {useCallback} from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/
const TIMING_CONFIG = {
  duration: 600,
  easing: Easing.inOut(Easing.quad),
} as const;

const INVERSE = true;

const REPEATS = 6;

const OPACITY_START = 1;

const OPACITY_END = 0.5;

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

export function usePulsing() {
  const opacity = useSharedValue(OPACITY_START);

  const pulsingStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const startPulsing = useCallback((onComplete?: () => void) => {
    if (opacity.value !== OPACITY_START) {
      return;
    }
    opacity.value = withRepeat(
      withTiming(OPACITY_END, TIMING_CONFIG),
      REPEATS,
      INVERSE,
      onComplete ? runOnJS(onComplete) : undefined,
    );
  }, []);

  const cancelPulsing = useCallback(() => {
    cancelAnimation(opacity);
    opacity.value = OPACITY_START;
  }, []);

  return {pulsingStyles, startPulsing, cancelPulsing};
}
