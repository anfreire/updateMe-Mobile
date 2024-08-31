import * as React from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export function useRotate() {
  const rotation = useSharedValue(0);

  const rotate = React.useCallback(() => {
    if (rotation.value !== 0) return;
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
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return { rotate, animatedStyles };
}
