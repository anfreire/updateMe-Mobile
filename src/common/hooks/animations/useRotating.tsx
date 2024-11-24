import {useCallback} from 'react';
import {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  cancelAnimation,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const SPRING_CONFIG = {
  mass: 7,
  damping: 40,
  stiffness: 100,
} as const;

const INVERSE = false;

const ROTATION_START = 0;

const ROTATION_END = 360;

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

export function useRotating(indefinitely: boolean = false) {
  const rotation = useSharedValue(ROTATION_START);

  const repeats = indefinitely ? -1 : 1;

  const rotatingStyles = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  const startRotating = useCallback(
    (onComplete?: () => void) => {
      if (rotation.value !== ROTATION_START) {
        return;
      }

      rotation.value = withRepeat(
        withSpring(ROTATION_END, SPRING_CONFIG, () => {
          rotation.value = ROTATION_START;
        }),
        repeats,
        INVERSE,
        onComplete ? runOnJS(onComplete) : undefined,
      );
    },
    [repeats],
  );

  const cancelRotating = useCallback(() => {
    cancelAnimation(rotation);
    rotation.value = ROTATION_START;
  }, []);

  return {
    rotatingStyles,
    startRotating,
    cancelRotating,
  };
}
