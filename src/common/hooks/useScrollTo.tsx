import {useCallback, useRef} from 'react';
import {ScrollView, useWindowDimensions, View} from 'react-native';

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
  const scrollViewRef = useRef<ScrollView>(null);
  const {height: screenHeight} = useWindowDimensions();

  const scrollToItem = useCallback(
    (itemRef: React.RefObject<View>) => {
      if (!itemRef.current || !scrollViewRef.current) {
        return;
      }

      itemRef.current.measureLayout(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        scrollViewRef.current as any,
        (_, top, __, height) => {
          scrollViewRef.current!.scrollTo({
            y: getScrollY(
              screenHeight,
              scrollViewRef.current!.getInnerViewNode().height,
              top,
              height,
            ),
          });
        },
      );
    },
    [screenHeight],
  );

  return {scrollViewRef, scrollToItem};
}
