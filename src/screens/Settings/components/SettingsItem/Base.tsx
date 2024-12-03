import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import {List} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import {useTranslations} from '@/stores/persistent/translations';
import {StyleSheet, View} from 'react-native';
import {usePulsing} from '@/common/hooks/usePulsing';
import {useRoute} from '@react-navigation/native';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import MultiIcon from '@/common/components/MultiIcon';
import {SettingsItemProps} from '.';
import {MainStackRoute} from '@/navigation/types';

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface SettingsItemBaseProps extends SettingsItemProps {
  rightItem: (props: {color: string; style?: Style}) => JSX.Element;
  onPress: () => void;
}

const SettingsItemBase = ({
  item,
  scrollToItem,
  rightItem,
  onPress,
}: SettingsItemBaseProps) => {
  const animatedListItemRef = useRef<View>(null);
  const translations = useTranslations(state => state.translations);
  const {pulsingStyles, startPulsing, cancelPulsing} = usePulsing();
  const {params} = useRoute<MainStackRoute>();

  const labels = useMemo(
    () => ({
      title: translations[item.title],
      description: translations[item.description],
    }),
    [item.title, item.description, translations],
  );

  const leftItem = useCallback(
    (props: {color: string; style: Style}) => (
      <View style={styles.iconWrapper}>
        <MultiIcon {...props} size={20} {...item.icon} />
      </View>
    ),
    [item.icon],
  );

  useLayoutEffect(() => {
    console.log(params);
    if (
      !animatedListItemRef.current ||
      !params ||
      !('section' in params) ||
      !('item' in params) ||
      params.section !== item.section ||
      params.item !== item.item
    ) {
      return;
    }
    startPulsing();
    scrollToItem(animatedListItemRef);

    return () => {
      cancelPulsing();
    };
  }, [
    params,
    item.section,
    item.item,
    startPulsing,
    scrollToItem,
    cancelPulsing,
  ]);

  return (
    <AnimatedListItem
      ref={animatedListItemRef}
      title={labels.title}
      description={labels.description}
      right={rightItem}
      left={leftItem}
      style={pulsingStyles}
      onPress={onPress}
    />
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(SettingsItemBase);
