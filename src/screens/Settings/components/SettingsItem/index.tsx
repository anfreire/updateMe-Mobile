import React from 'react';
import {View} from 'react-native';
import {SettingsScreenItem} from '../../data';
import SettingsItemCheckbox from './Checkbox';
import SettingsItemDialog from './Dialog';
import SettingsItemScreen from './Screen';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const ITEM_TYPE_TO_COMPONENT = {
  checkbox: SettingsItemCheckbox,
  dialog: SettingsItemDialog,
  screen: SettingsItemScreen,
} as const;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

export interface SettingsItemProps<
  T extends SettingsScreenItem = SettingsScreenItem,
> {
  item: T;
  scrollToItem: (itemRef: React.RefObject<View>) => void;
}

const SettingsItem = ({item, scrollToItem}: SettingsItemProps) => {
  const Component = ITEM_TYPE_TO_COMPONENT[item.type];
  return <Component item={item as never} scrollToItem={scrollToItem} />;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(SettingsItem);
