import React, {memo, useCallback} from 'react';
import {useSettings} from '@/stores/persistent/settings';
import {useShallow} from 'zustand/shallow';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import {View} from 'react-native';
import {Checkbox} from 'react-native-paper';
import SettingsItemBase from './SettingsItemBase';
import {SettingsItemProps} from '.';
import {SettingsScreenItemCheckbox} from '../../data';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface SettingsItemCheckboxProps extends Omit<SettingsItemProps, 'item'> {
  item: SettingsScreenItemCheckbox;
}

const SettingsItemCheckbox = ({
  item,
  scrollToItem,
  route,
}: SettingsItemCheckboxProps) => {
  const [persistedValue, setSettingWithPrevious] = useSettings(
    useShallow(state => [
      state.settings[item.data.section][item.data.item!],
      state.setSettingWithPrevious,
    ]),
  );

  const onPress = useCallback(() => {
    setSettingWithPrevious(
      item.data.section,
      item.data.item,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prev => !prev as any,
    );
  }, [item.data.section, item.data.item]);

  const rightItem = useCallback(
    (props: {color: string; style?: Style}) => (
      <View className="justify-center items-center">
        <Checkbox
          status={persistedValue ? 'checked' : 'unchecked'}
          onPress={onPress}
          {...props}
        />
      </View>
    ),
    [persistedValue, onPress],
  );

  return (
    <SettingsItemBase
      item={item as unknown as SettingsScreenItemCheckbox}
      rightItem={rightItem}
      scrollToItem={scrollToItem}
      route={route}
    />
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(SettingsItemCheckbox);
