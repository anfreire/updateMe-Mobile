import React, {useMemo} from 'react';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {buildMultiIcon} from '@/common/components/MultiIcon';
import {Dialog, useDialogs} from '@/stores/runtime/dialogs';
import {Linking} from 'react-native';
import {useTranslations} from '@/stores/persistent/translations';
import {DrawerItemBase} from '..';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export interface DrawerItemLink extends DrawerItemBase {
  type: 'link';
  data: string;
}

export interface DrawerItemDialog extends DrawerItemBase {
  type: 'dialog';
  data: Dialog;
}

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const REPORT_BUG_URL =
  'https://github.com/anfreire/updateMe-Mobile/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=%5BBUG%5D';

const DRAWER_ITEMS: (DrawerItemLink | DrawerItemDialog)[] = [
  {
    title: 'Share',
    icon: {name: 'share-variant'},
    type: 'dialog',
    data: 'share',
  },
  {
    title: 'Report',
    icon: {name: 'bug'},
    type: 'link',
    data: REPORT_BUG_URL,
  },
];

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const DrawerContent = (props: DrawerContentComponentProps) => {
  const translations = useTranslations(state => state.translations);
  const openDialog = useDialogs(state => state.openDialog);

  const items = useMemo(
    () =>
      DRAWER_ITEMS.map(item => ({
        label: translations[item.title],
        icon: buildMultiIcon(item.icon.name, item.icon.type),
        onPress:
          item.type === 'link'
            ? () => {
                props.navigation.closeDrawer();
                Linking.openURL(item.data);
              }
            : () => {
                props.navigation.closeDrawer();
                openDialog(item.data);
              },
      })),
    [props.navigation, translations],
  );

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {items.map(item => (
        <DrawerItem key={item.label} {...item} />
      ))}
    </DrawerContentScrollView>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default DrawerContent;
