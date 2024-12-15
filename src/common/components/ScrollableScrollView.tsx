import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  scrollTo,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  HostComponent,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const TIMING_CONFIG = {
  duration: 600,
  easing: Easing.bezier(0.4, 0, 0.2, 1),
};

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function getScrollY(
  visibleHeight: number,
  contentHeight: number,
  itemTop: number,
  itemHeight: number,
) {
  const itemMiddle = itemTop + itemHeight / 2;
  const scrollPos = itemMiddle - visibleHeight / 2;
  const maxScroll = contentHeight - visibleHeight;
  return Math.max(0, Math.min(scrollPos, maxScroll));
}

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export interface ScrollableScrollViewHandle {
  scrollToItem: (ref: View) => void;
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface ScrollableScrollViewProps {
  children: React.ReactNode[];
}

const ScrollableScrollView = forwardRef<
  ScrollableScrollViewHandle,
  ScrollableScrollViewProps
>(({children}, handle) => {
  const [dimensions, setDimensions] = useState({
    contentHeight: 0,
    visibleHeight: 0,
  });
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const monitoredScrollY = useSharedValue(0);
  const pendingScrollRef = useRef<View | null>(null);

  const dimensionsAreSet =
    dimensions.contentHeight > 0 && dimensions.visibleHeight > 0;

  useDerivedValue(() => {
    'worklet';
    scrollTo(scrollViewRef, 0, scrollY.value, false);
  }, []);

  const handleOnContentSizeChange = useCallback(
    (_: number, height: number) =>
      setDimensions(prev => ({...prev, contentHeight: height})),
    [],
  );

  const handleOnLayout = useCallback(
    (event: LayoutChangeEvent) =>
      setDimensions(prev => ({
        ...prev,
        visibleHeight: event.nativeEvent.layout.height,
      })),
    [],
  );

  const handleOnScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      monitoredScrollY.value = event.nativeEvent.contentOffset.y;
    },
    [],
  );

  const scrollToItem = useCallback(
    (item: View | null) => {
      if (!item || !scrollViewRef.current) {
        return;
      }

      if (!dimensionsAreSet) {
        pendingScrollRef.current = item;
        return;
      }

      scrollY.value = monitoredScrollY.value;

      item.measureLayout(
        scrollViewRef.current as unknown as React.ElementRef<
          HostComponent<unknown>
        >,
        (_, itemTop, __, itemHeight) => {
          const scrollYDest = getScrollY(
            dimensions.visibleHeight,
            dimensions.contentHeight,
            itemTop,
            itemHeight,
          );

          scrollY.value = withTiming(scrollYDest, TIMING_CONFIG, () => {
            pendingScrollRef.current = null;
          });
        },
      );
    },
    [dimensionsAreSet, dimensions],
  );

  useEffect(() => {
    if (dimensionsAreSet && pendingScrollRef.current) {
      scrollToItem(pendingScrollRef.current);
    }
  }, [dimensionsAreSet, scrollToItem]);

  useFocusEffect(
    useCallback(() => {
      return () => cancelAnimation(scrollY);
    }, []),
  );

  useImperativeHandle(
    handle,
    () => ({
      scrollToItem,
    }),
    [scrollToItem],
  );

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      style={styles.scrollView}
      onScroll={handleOnScroll}
      onContentSizeChange={handleOnContentSizeChange}
      onLayout={handleOnLayout}
      removeClippedSubviews={true}
      scrollEventThrottle={32}>
      {children}
    </Animated.ScrollView>
  );
});

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

export default memo(ScrollableScrollView);
