import * as React from 'react';
import {ListRenderItem} from '@shopify/flash-list';
import {IconButton, List} from 'react-native-paper';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import FastImage from 'react-native-fast-image';
import {StyleSheet, View} from 'react-native';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function buildCheckbox(
  checked: boolean,
  onPress: () => void,
  colors: {icon: string; container: string},
) {
  return (props: {color: string; style?: Style}) => (
    <IconButton
      icon={checked ? 'sync-off' : 'sync'}
      style={props.style}
      iconColor={colors.icon}
      containerColor={colors.container}
      onPress={onPress}
      size={20}
    />
  );
}

function buildAppIcon(icon: string, checked: boolean) {
  return () => (
    <View style={styles.iconWrapper}>
      <FastImage
        style={styles.icon}
        source={{uri: icon}}
        resizeMode={FastImage.resizeMode.contain}
      />
      {checked ? (
        <FastImage
          source={{uri: icon}}
          resizeMode={FastImage.resizeMode.contain}
          style={styles.grayFilter}
          tintColor={'gray'}
        />
      ) : null}
    </View>
  );
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface IgnoredAppsItemProps {
  icon: string;
  app: string;
  checked: boolean;
  colors: {icon: string; container: string; wrapper: string};
  onPress: () => void;
}

const IgnoredAppsItem: ListRenderItem<IgnoredAppsItemProps> = ({item}) => (
  <List.Item
    title={item.app}
    left={buildAppIcon(item.icon, item.checked)}
    right={buildCheckbox(item.checked, item.onPress, item.colors)}
    style={[styles.container, {backgroundColor: item.colors.wrapper}]}
  />
);

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/
const styles = StyleSheet.create({
  container: {
    marginVertical: 0.5,
  },
  iconWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },

  grayFilter: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 5,
    opacity: 0.75,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default IgnoredAppsItem;
