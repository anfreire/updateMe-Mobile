import * as React from 'react';
import {useIndex} from '@/states/fetched';
import {Link} from '@react-navigation/native';
import {Text, TouchableRipple} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import AppIcon from '../../common/appIcon';

interface HomeGridItemProps {
  app: string;
  themedStyles: {backgroundColor: string; borderColor: string};
  itemWidth: number;
}
const HomeGridItem = ({app, themedStyles, itemWidth}: HomeGridItemProps) => {
  const index = useIndex(state => state.index);

  return (
    <Link to={{screen: 'app', params: {app}}}>
      <TouchableRipple style={[styles.item, themedStyles, {width: itemWidth}]}>
        <>
          <AppIcon homeLayout="grid" uri={index[app].icon} />
          <Text style={styles.itemTitle}>{app}</Text>
        </>
      </TouchableRipple>
    </Link>
  );
};

const styles = StyleSheet.create({
  item: {
    aspectRatio: 1,
    gap: 10,
    elevation: 1,
    borderWidth: 1,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    textAlign: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

HomeGridItem.displayName = 'HomeGridItem';

export default React.memo(HomeGridItem);
