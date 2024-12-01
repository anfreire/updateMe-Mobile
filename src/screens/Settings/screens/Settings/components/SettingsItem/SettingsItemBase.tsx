import React, {memo, useCallback, useEffect, useMemo, useRef} from 'react';
import {useTranslations} from '@/stores/persistent/translations';
import {List} from 'react-native-paper';
import Animated, {useAnimatedRef} from 'react-native-reanimated';
import {SettingsScreenItem} from '../../data';
import {View} from 'react-native';
import {SettingsScreenProps} from '../..';
import {usePulsing} from '@/common/hooks/usePulsing';
import MultiIcon from '@/common/components/MultiIcon';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import {useFocusEffect} from '@react-navigation/native';

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface SettingsItemBaseProps {
  item: SettingsScreenItem;
  scrollToItem: (itemRef: React.RefObject<View>) => void;
  route: SettingsScreenProps['route'];
  rightItem: (props: {color: string; style?: Style}) => React.ReactNode;
  onPress?: () => void;
}

const SettingsItemBase = ({
  item,
  scrollToItem,
  route,
  rightItem,
  onPress,
}: SettingsItemBaseProps) => {
  const translations = useTranslations(state => state.translations);
  const animatedListItemRef = useRef<View>(null);
  const {pulsingStyles, startPulsing, cancelPulsing} = usePulsing();

  const labels = useMemo(
    () => ({
      title: translations[item.title],
      description: translations[item.description],
    }),
    [item.title, item.description, translations],
  );

  const buildLeftIcon = useCallback(
    (props: {color: string; style: Style}) => (
      <View className="justify-center items-center">
        <MultiIcon {...props} size={20} {...item.icon} />
      </View>
    ),
    [item.icon],
  );

  const handleOnLayout = useCallback(() => {
    console.log('SettingsItemBase handleOnLayout', item.title, route.params);
    if (
      !animatedListItemRef.current ||
      !route.params ||
      !('settingTitle' in route.params) ||
      route.params.settingTitle !== item.title
    ) {
      return;
    }

    startPulsing();
    scrollToItem(animatedListItemRef);
  }, [item.title, route.params, startPulsing, scrollToItem]);

  useEffect(() => {
    return () => {
      cancelPulsing();
    };
  }, [cancelPulsing]);

  useFocusEffect(handleOnLayout);

  return (
    <View ref={animatedListItemRef}>
      <AnimatedListItem
        title={labels.title}
        description={labels.description}
        right={rightItem}
        left={buildLeftIcon}
        style={pulsingStyles}
        onPress={onPress}
      />
    </View>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(SettingsItemBase);
