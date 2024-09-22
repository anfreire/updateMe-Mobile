import {useIndex} from '@/states/fetched';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {List} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import AppIcon from '@/pages/home/components/common/appIcon';
import {NavigationProps} from '@/types/navigation';

export interface HomeCategoryItemProps {
  app: string;
}

const HomeCategoryItem = ({app}: HomeCategoryItemProps) => {
  const index = useIndex(state => state.index);
  const {navigate} = useNavigation<NavigationProps>();

  const CategoriesAppIcon = React.useCallback(
    () => <AppIcon homeLayout="categories" uri={index[app].icon} />,
    [app, index],
  );

  const handleOnPress = React.useCallback(() => {
    navigate('app', {app});
  }, [app, navigate]);

  return (
    <List.Item
      key={app}
      title={app}
      style={styles.homeCategoryItem}
      left={CategoriesAppIcon}
      onPress={handleOnPress}
    />
  );
};

const styles = StyleSheet.create({
  homeCategoryItem: {
    paddingLeft: 25,
    backgroundColor: 'transparent',
    width: '100%',
  },
});

HomeCategoryItem.displayName = 'HomeCategoryItem';

export default React.memo(HomeCategoryItem);
