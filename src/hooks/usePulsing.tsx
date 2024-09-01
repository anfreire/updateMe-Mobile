import * as React from "react";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export function usePulsing(animate: boolean) {
  const opacity = useSharedValue(1);
  const prevAnimateRef = React.useRef<boolean>(animate);

  React.useEffect(() => {
    if (prevAnimateRef.current === animate) {
      return;
    }

    prevAnimateRef.current = animate;
    
    if (!animate) {
      opacity.value = 1;
      return;
    }

    opacity.value = withRepeat(
      withTiming(0.5, {
        duration: 600,
        easing: Easing.inOut(Easing.quad),
      }),
      5,
      true
    );

    return () => {
      opacity.value = 1;
    };
  }, [animate]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
}
