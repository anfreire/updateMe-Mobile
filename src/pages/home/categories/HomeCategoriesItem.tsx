import * as React from 'react';
import {useIndex} from '@/states/fetched';
import {Image, StyleSheet} from 'react-native';
import {List} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '@/types/navigation';

export interface HomeItemProps {
  app: string;
}

const HomeCategoriesItem = ({app}: HomeItemProps) => {
  const index = useIndex(state => state.index);
  const {navigate} = useNavigation<NavigationProps>();

  const buildAppIcon = React.useCallback(
    () => (
      <Image
        resizeMode="contain"
        style={styles.appIcon}
        source={{uri: index[app].icon}}
      />
    ),
    [app, index],
  );

  const handleOnPress = React.useCallback(() => {
    navigate('app', {app});
  }, [app, navigate]);

  return (
    <List.Item
      key={app}
      title={app}
      style={styles.homeItem}
      left={buildAppIcon}
      onPress={handleOnPress}
    />
  );
};

const styles = StyleSheet.create({
  appIcon: {
    width: 25,
    height: 25,
  },
  homeItem: {
    paddingLeft: 25,
    backgroundColor: 'transparent',
    width: '100%',
  },
});

export default React.memo(HomeCategoriesItem);
