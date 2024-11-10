import {useTheme} from '@/theme';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {RenderItemParams} from 'react-native-draggable-flatlist';
import {List} from 'react-native-paper';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const RightItem = (props: {color: string; styles?: Style}) => (
  <List.Icon {...props} icon="drag" />
);

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const ProvidersPriorityListItem = ({
  item,
  drag,
  isActive,
}: RenderItemParams<string>) => {
  const {schemedTheme} = useTheme();

  return (
    <List.Item
      style={[styles.item, {backgroundColor: schemedTheme.elevation.level5}]}
      title={item}
      onLongPress={drag}
      disabled={isActive}
      right={RightItem}
    />
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  item: {
    padding: 0,
    margin: 0,
    marginVertical: 0.5,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default ProvidersPriorityListItem;
