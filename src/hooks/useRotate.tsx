import * as React from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export function useRotate(animate: boolean) {
  const rotation = useSharedValue(0);
  const prevAnimateRef = React.useRef<boolean>(animate);

  React.useEffect(() => {
    if (prevAnimateRef.current === animate) {
      return;
    }

    prevAnimateRef.current = animate;
    if (!animate) {
      rotation.value = 0;
      return;
    }

    rotation.value = withSpring(
      360,
      {
        mass: 7,
        damping: 40,
        stiffness: 100,
      },
      () => {
        rotation.value = 0;
      }
    );

    return () => {
      rotation.value = 0;
    };
  }, [animate]);

  return useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
}
