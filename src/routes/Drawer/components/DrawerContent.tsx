import React, {useCallback} from 'react';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {buildMultiIcon, MultiIconType} from '@/common/components/MultiIcon';
import {Dialog, useDialogs} from '@/stores/runtime/dialogs';
import {Linking} from 'react-native';
import {Translation, useTranslations} from '@/stores/persistent/translations';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export interface DrawerItemBase {
  title: Translation;
  icon: {name: string; type?: MultiIconType};
}

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

  const buildOnPress = useCallback(
    (item: DrawerItemLink | DrawerItemDialog) => {
      return () => {
        if (item.type === 'link') {
          Linking.openURL(item.data);
        } else {
          openDialog(item.data);
        }
      };
    },
    [],
  );

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {DRAWER_ITEMS.map(item => (
        <DrawerItem
          key={item.title}
          label={translations[item.title]}
          icon={buildMultiIcon(item.icon.name)}
          onPress={buildOnPress(item)}
        />
      ))}
    </DrawerContentScrollView>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default DrawerContent;
