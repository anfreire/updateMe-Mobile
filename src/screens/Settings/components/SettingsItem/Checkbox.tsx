import React, {memo, useCallback} from 'react';
import {useSettings} from '@/stores/persistent/settings';
import {SettingsItemProps} from '.';
import {useShallow} from 'zustand/shallow';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import {Checkbox} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import SettingsItemBase from './Base';
import {SettingsScreenItemCheckbox} from '../../data';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const SettingsItemCheckbox = ({
  item,
  scrollToItem,
}: SettingsItemProps<SettingsScreenItemCheckbox>) => {
  const [persistedValue, setSettingWithPrevious] = useSettings(
    useShallow(state => [
      state.settings[item.section][item.item!],
      state.setSettingWithPrevious,
    ]),
  );

  const onPress = useCallback(() => {
    setSettingWithPrevious(
      item.section,
      item.item,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prev => !prev as any,
    );
  }, [item.section, item.item]);

  const rightItem = useCallback(
    (props: {color: string; style?: Style}) => (
      <View style={styles.iconWrapper}>
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
      item={item}
      scrollToItem={scrollToItem}
      rightItem={rightItem}
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

export default memo(SettingsItemCheckbox);
