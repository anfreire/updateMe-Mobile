import {useIndex} from '@/states/fetched';
import {Link} from '@react-navigation/native';
import * as React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {List} from 'react-native-paper';
import AppIcon from '../../common/appIcon';

interface HomeListItemProps {
  app: string;
  themedStyles: ViewStyle;
}

const HomeListItem = ({app, themedStyles}: HomeListItemProps) => {
  const index = useIndex(state => state.index);

  const ListAppIcon = React.useCallback(
    () => <AppIcon homeLayout="list" uri={index[app].icon} />,
    [index, app],
  );

  return (
    <Link to={{screen: 'app', params: {app}}}>
      <List.Item
        title={app}
        style={[styles.listItem, themedStyles]}
        titleStyle={styles.listItemTitle}
        left={ListAppIcon}
      />
    </Link>
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingLeft: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderRadius: 20,
    elevation: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemTitle: {
    fontSize: 18,
  },
});

HomeListItem.displayName = 'HomeListItem';

export default React.memo(HomeListItem);
