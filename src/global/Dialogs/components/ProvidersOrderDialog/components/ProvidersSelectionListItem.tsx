import {ListRenderItem} from '@shopify/flash-list';
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Checkbox, List} from 'react-native-paper';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/
function buildCheckbox(checked: boolean, onPress: () => void) {
  return (props: {color: string; style?: Style}) => (
    <View style={[styles.checkbox, props.style]}>
      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={onPress}
        color={props.color}
      />
    </View>
  );
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface ProvidersSelectionListItemProps {
  provider: string;
  checked: boolean;
  onPress: () => void;
}

const ProvidersSelectionListItem: ListRenderItem<
  ProvidersSelectionListItemProps
> = ({item}) => {
  return (
    <List.Item
      title={item.provider}
      titleNumberOfLines={1}
      right={buildCheckbox(item.checked, item.onPress)}
    />
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/
const styles = StyleSheet.create({
  checkbox: {
    justifyContent: 'center',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default ProvidersSelectionListItem;
