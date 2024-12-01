import React, {memo, useCallback} from 'react';
import {SettingsItemProps} from '.';
import {SettingsScreenItemScreen} from '../../data';
import {View} from 'react-native';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import MultiIcon from '@/common/components/MultiIcon';
import SettingsItemBase from './SettingsItemBase';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const rightItem = ({color, style}: {color: string; style?: Style}) => (
  <View className="justify-center items-center">
    <MultiIcon
      color={color}
      style={style}
      size={20}
      type="material-icons"
      name="chevron-right"
    />
  </View>
);

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface SettingsItemScreenProps extends Omit<SettingsItemProps, 'item'> {
  item: SettingsScreenItemScreen;
}

const SettingsItemScreen = ({
  item,
  scrollToItem,
  navigation,
  route,
}: SettingsItemScreenProps) => {
  const onPress = useCallback(
    () => navigation.navigate(item.data),
    [item, navigation],
  );

  return (
    <SettingsItemBase
      item={item}
      scrollToItem={scrollToItem}
      route={route}
      rightItem={rightItem}
      onPress={onPress}
    />
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(SettingsItemScreen);
