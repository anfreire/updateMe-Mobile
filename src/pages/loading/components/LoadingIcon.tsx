import * as React from 'react';
import {useTheme} from '@/theme';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Path, Svg} from 'react-native-svg';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const SVG_WIDTH = 150;
const SVG_HEIGHT = 150;
const SVG_VIEW_BOX = '-1.5 0 12.16 12.16';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const PATH_STROKE_WIDTH = 0.5;
const PATH_D =
  'M3.25 2.464v2.124a.647.655 0 01-1.293 0v-.617a3.391 3.434 0 00-.648 1.444.647.655 0 11-1.268-.252 4.685 4.745 0 01.934-2.046h-.47a.647.655 0 110-1.308h2.097a.647.655 0 01.647.655zM1.207 8.337a.645.654 0 01-.852-.333 4.707 4.767 0 01-.233-.658.647.655 0 111.246-.35 3.437 3.48 0 00.168.477.646.654 0 01-.329.864zm1.824 1.55a.645.654 0 01-.891.205 4.723 4.783 0 01-.556-.414.647.655 0 01.842-.994 3.413 3.456 0 00.403.3.647.655 0 01.202.904zm2.311.28a.647.655 0 01-.637.663H4.64a4.702 4.761 0 01-.51-.028.647.655 0 01.141-1.3 3.397 3.44 0 00.417.019h.009a.647.655 0 01.647.645zm.021-8.17a.647.655 0 01-.646.643h-.02a.647.655 0 01.01-1.31h.023a.647.655 0 01.633.668zm2.032 7.154a.646.654 0 01-.188.906 4.695 4.754 0 01-.5.288.647.655 0 11-.569-1.176 3.44 3.484 0 00.363-.208.647.655 0 01.894.19zM6.15 2.223a.646.654 0 01.885-.228l.011.007a.647.655 0 11-.665 1.122l-.007-.004a.646.654 0 01-.224-.897zM8.823 8.23a4.71 4.769 0 01-.197.356.647.655 0 11-1.099-.69 3.146 3.186 0 00.144-.258.647.655 0 111.152.591zM7.593 4.38a.647.655 0 011.124-.646l.005.008a.647.655 0 11-1.124.647zM9.33 5.962a5.856 5.93 0 010 .233.647.655 0 01-.646.639h-.016a.647.655 0 01-.63-.671 2.904 2.94 0 000-.17.647.655 0 01.63-.67h.016a.647.655 0 01.646.638z';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useLoadingIcon() {
  const {sourceColor} = useTheme();
  const animation = useSharedValue(0);

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${animation.value}deg`}],
    };
  });

  React.useEffect(() => {
    animation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.inOut(Easing.cubic),
      }),
      -1,
    );

    return () => {
      animation.value = 0;
    };
  }, []);

  return {animationStyle, sourceColor};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const LoadingIcon = () => {
  const {animationStyle, sourceColor} = useLoadingIcon();

  return (
    <AnimatedSvg
      style={animationStyle}
      width={SVG_WIDTH}
      height={SVG_HEIGHT}
      viewBox={SVG_VIEW_BOX}>
      <AnimatedPath
        fill={sourceColor}
        strokeWidth={PATH_STROKE_WIDTH}
        d={PATH_D}
      />
    </AnimatedSvg>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default LoadingIcon;
