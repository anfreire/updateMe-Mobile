import {useEffect, useRef} from 'react';

export function useAnimation(
  animate: boolean,
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
  }, [animate, startAnimation, cancelAnimation]);
}
