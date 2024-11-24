import {useEffect, useRef} from 'react';
import {DefaultStyle} from 'react-native-reanimated/lib/typescript/hook/commonTypes';

export function useAnimation(
  animate: boolean,
  animatedStyles: DefaultStyle,
  startAnimation: (onComplete?: () => void) => void,
  cancelAnimation: () => void,
) {
  const isAnimating = useRef(false);

  useEffect(() => {
    'worklet';

    if (isAnimating.current) {
      if (!animate) {
        cancelAnimation();
        isAnimating.current = false;
      }
      return;
    }

    startAnimation(() => {
      isAnimating.current = false;
    });

    isAnimating.current = true;

    return () => {
      'worklet';
      if (isAnimating.current) {
        cancelAnimation();
        isAnimating.current = false;
      }
    };
  }, [animate, animatedStyles, startAnimation, cancelAnimation]);

  return animatedStyles;
}
