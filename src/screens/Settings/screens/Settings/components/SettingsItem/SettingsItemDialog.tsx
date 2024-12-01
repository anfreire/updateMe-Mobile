import React, {memo, useCallback} from 'react';
import {useDialogs} from '@/stores/runtime/dialogs';
import {SettingsItemProps} from '.';
import {SettingsScreenItemDialog} from '../../data';
import {View} from 'react-native';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import MultiIcon from '@/common/components/MultiIcon';
import SettingsItemBase from './SettingsItemBase';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const rightItem = ({color, style}: {color: string; style?: Style}) => (
  <View className="justify-center items-center">
    <MultiIcon color={color} style={style} size={20} name="open-in-app" />
  </View>
);

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface SettingsItemDialogProps extends Omit<SettingsItemProps, 'item'> {
  item: SettingsScreenItemDialog;
}

const SettingsItemDialog = ({
  item,
  scrollToItem,
  route,
}: SettingsItemDialogProps) => {
  const openDialog = useDialogs(state => state.openDialog);

  const onPress = useCallback(() => openDialog(item.data), [item]);

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

export default memo(SettingsItemDialog);
