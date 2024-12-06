import {useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
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

  const startPulsing = useCallback(async () => {
    'worklet';
    return new Promise<void>(resolve => {
      if (opacity.value !== OPACITY_START) {
        resolve();
        return;
      }
      opacity.value = withRepeat(
        withTiming(OPACITY_END, TIMING_CONFIG),
        REPEAT_TIMES,
        true,
        () => {
          runOnJS(resolve)();
        },
      );
    });
  }, []);

  const cancelPulsing = useCallback(() => {
    cancelAnimation(opacity);
    opacity.value = OPACITY_START;
  }, []);

  useFocusEffect(
    useCallback(() => {
      return cancelPulsing;
    }, [cancelPulsing]),
  );

  return {startPulsing, cancelPulsing, pulsingStyles};
}
