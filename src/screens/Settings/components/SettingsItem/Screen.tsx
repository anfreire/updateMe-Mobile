import React, {memo, useCallback} from 'react';
import {SettingsItemProps} from '.';
import {SettingsScreenItemScreen} from '../../data';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import MultiIcon from '@/common/components/MultiIcon';
import {StyleSheet, View} from 'react-native';
import SettingsItemBase from './Base';
import {useNavigate} from '@/common/hooks/useNavigate';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const rightItem = (props: {color: string; style?: Style}) => (
  <View style={styles.iconWrapper}>
    <MultiIcon {...props} size={20} name="chevron-right" />
  </View>
);

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const SettingsItemScreen = ({
  item,
  scrollToItem,
}: SettingsItemProps<SettingsScreenItemScreen>) => {
  const navigate = useNavigate();

  const onPress = useCallback(
    () =>
      navigate({stack: 'settings-stack', screen: item.data, params: undefined}),
    [item.data, navigate],
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

export default memo(SettingsItemScreen);
