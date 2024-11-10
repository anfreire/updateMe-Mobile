import * as React from 'react';
import {ListRenderItem, StyleSheet, View} from 'react-native';
import {List} from 'react-native-paper';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import Animated from 'react-native-reanimated';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const buildListIcon =
  (icon: string) => (props: {color: string; style: Style}) => (
    <View style={styles.iconWrapper}>
      <List.Icon {...props} icon={icon} />
    </View>
  );

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

export interface DrawerListItemProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  style?: {opacity: number};
}

const DrawerListItem: ListRenderItem<DrawerListItemProps> = ({item}) => {
  return (
    <AnimatedListItem
      title={item.title}
      description={item.description}
      left={buildListIcon(item.icon)}
      onPress={item.onClick}
      style={item.style}
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

export default DrawerListItem;
