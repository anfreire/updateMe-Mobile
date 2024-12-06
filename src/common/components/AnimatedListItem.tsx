import React, {memo, useCallback, useEffect, useRef} from 'react';
import {List} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import {buildMultiIcon, useMultiIconProps} from './MultiIcon';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import {forwardRef} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {usePulsing} from '../hooks/usePulsing';
import {MainStackRoute} from '@/navigation/types';
import {useRoute} from '@react-navigation/native';

const AnimatedListItemComponent = Animated.createAnimatedComponent(List.Item);

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

type ItemType =
  | ((props: {color: string; style?: Style}) => React.ReactNode)
  | useMultiIconProps;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

export interface AnimatedListItemProps {
  title: string;
  description?: string;
  left?: ItemType;
  right?: ItemType;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  shouldPulse?: (params: object) => boolean;
}

const AnimatedListItem = forwardRef<View, AnimatedListItemProps>(
  ({title, description, left, right, onPress, style, shouldPulse}, ref) => {
    const {pulsingStyles, startPulsing, cancelPulsing} = usePulsing();
    const {params} = useRoute<MainStackRoute>();
    const shouldPulseRef = useRef(shouldPulse);

    const leftItem = useCallback(
      (props: {color: string; style?: Style}) => {
        if (!left) {
          return null;
        }
        return typeof left === 'function'
          ? left(props)
          : buildMultiIcon(left.name, left.type)(props);
      },
      [left],
    );

    const rightItem = useCallback(
      (props: {color: string; style?: Style}) => {
        if (!right) {
          return null;
        }
        return typeof right === 'function'
          ? right(props)
          : buildMultiIcon(right.name, right.type)(props);
      },
      [right],
    );

    useEffect(() => {
      if (!params || !shouldPulseRef.current) {
        return;
      }
      if (shouldPulseRef.current(params)) {
        startPulsing();
        return () => cancelPulsing();
      }
    }, [params, startPulsing, cancelPulsing]);

    return (
      <AnimatedListItemComponent
        ref={ref}
        title={title}
        description={description}
        left={leftItem}
        right={rightItem}
        onPress={onPress}
        style={[style, pulsingStyles]}
      />
    );
  },
);

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(AnimatedListItem);
