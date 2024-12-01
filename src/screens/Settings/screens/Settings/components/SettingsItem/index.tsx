import React, {memo, useMemo} from 'react';
import {View} from 'react-native';
import {SettingsScreenItem} from '../../data';
import {SettingsScreenProps} from '../..';
import SettingsItemCheckbox from './SettingsItemCheckbox';
import SettingsItemSelect from './SettingsItemSelect';
import SettingsItemDialog from './SettingsItemDialog';
import SettingsItemScreen from './SettingsItemScreen';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const SETTINGS_ITEM_TYPE_TO_COMPONENT = {
  checkbox: SettingsItemCheckbox,
  select: SettingsItemSelect,
  dialog: SettingsItemDialog,
  screen: SettingsItemScreen,
} as const;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

export interface SettingsItemProps extends SettingsScreenProps {
  item: SettingsScreenItem;
  scrollToItem: (itemRef: React.RefObject<View>) => void;
}

const SettingsItem = (props: SettingsItemProps) => {
  const Component = useMemo(
    () => SETTINGS_ITEM_TYPE_TO_COMPONENT[props.item.type],
    [props.item.type],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Component {...(props as any)} />;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(SettingsItem);
