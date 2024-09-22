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
      -1,
      true,
    );
  }, []);

  const cancelPulsing = React.useCallback(() => {
    cancelAnimation(opacity);
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
    if (isPulsing.current || !pulse) return;

    startPulsing(() => {
      isPulsing.current = false;
    });
    isPulsing.current = true;

    return () => {
      if (isPulsing.current) {
        cancelPulsing();
        isPulsing.current = false;
      }
    };
  }, [pulse, cancelPulsing, startPulsing]);

  return pulsingStyles;
}
