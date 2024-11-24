import * as React from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';

export function usePulsing() {
  const opacity = useSharedValue(1);

  const startPulsing = React.useCallback((afterPulsing?: () => void) => {
    if (opacity.value !== 1) {
      return;
    }
    opacity.value = withRepeat(
      withTiming(
        0.5,
        {
          duration: 600,
          easing: Easing.inOut(Easing.quad),
        },
        afterPulsing,
      ),
      6,
      true,
    );
  }, []);

  const cancelPulsing = React.useCallback(() => {
    cancelAnimation(opacity);
    opacity.value = 1;
  }, []);

  const pulsingStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return {startPulsing, cancelPulsing, pulsingStyles};
}

export function usePulsingStyles(pulse: boolean) {
  const {pulsingStyles, startPulsing, cancelPulsing} = usePulsing();
  const isPulsing = React.useRef(false);

  React.useEffect(() => {
    'worklet';
    if (isPulsing.current || !pulse) {
      if (!pulse) {
        cancelPulsing();
        isPulsing.current = false;
      }
      return;
    }

    startPulsing(() => {
      'worklet';
      isPulsing.current = false;
    });
    isPulsing.current = true;

    return () => {
      'worklet';
      if (isPulsing.current) {
        cancelPulsing();
        isPulsing.current = false;
      }
    };
  }, [pulse, cancelPulsing, startPulsing]);

  return pulsingStyles;
}
