import React, {memo, useCallback} from 'react';
import {SettingsItemProps} from '.';
import {useDialogs} from '@/stores/runtime/dialogs';
import {SettingsScreenItemDialog} from '../../data';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import MultiIcon from '@/common/components/MultiIcon';
import {StyleSheet, View} from 'react-native';
import SettingsItemBase from './Base';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const rightItem = (props: {color: string; style?: Style}) => (
  <View style={styles.iconWrapper}>
    <MultiIcon {...props} size={20} name="open-in-app" />
  </View>
);

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const SettingsItemDialog = ({
  item,
  scrollToItem,
}: SettingsItemProps<SettingsScreenItemDialog>) => {
  const openDialog = useDialogs(state => state.openDialog);

  const onPress = useCallback(() => openDialog(item.data), [item]);

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

export default memo(SettingsItemDialog);
