import * as React from 'react';
import {useWindowDimensions, View} from 'react-native';
import Animated, {
  useAnimatedRef,
  useSharedValue,
  scrollTo as reanimatedScrollTo,
  withTiming,
  Easing,
  useDerivedValue,
} from 'react-native-reanimated';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/
const TIMING_CONFIG = {
  duration: 1600,
  easing: Easing.bezier(0.4, 0, 0.2, 1),
};

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function getScrollY(
  screenHeight: number,
  contentHeight: number,
  itemTop: number,
  itemHeight: number,
) {
  const itemMiddle = itemTop + itemHeight / 2;
  const scrollPos = itemMiddle - screenHeight / 2;
  const maxScroll = contentHeight - screenHeight;
  return scrollPos < 0 ? 0 : scrollPos > maxScroll ? maxScroll : scrollPos;
}

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

export function useScrollTo() {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const {height: screenHeight} = useWindowDimensions();

  useDerivedValue(() => {
    reanimatedScrollTo(scrollViewRef, 0, scrollY.value, true);
  });

  const scrollToPos = React.useCallback((y: number) => {
    scrollY.value = withTiming(y, TIMING_CONFIG);
  }, []);

  const scrollToItem = React.useCallback(
    (itemRef: React.RefObject<View>) => {
      if (!itemRef.current || !scrollViewRef.current) {
        return;
      }
      itemRef.current.measureLayout(
        scrollViewRef.current.getInnerViewNode(),
        (_, top, __, height) => {
          scrollToPos(
            getScrollY(
              screenHeight,
              scrollViewRef.current!.getInnerViewNode().height,
              top,
              height,
            ),
          );
        },
      );
    },
    [screenHeight, scrollToPos],
  );

  return {scrollViewRef, scrollToItem, scrollToPos};
}
