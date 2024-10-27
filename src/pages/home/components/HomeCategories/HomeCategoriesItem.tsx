import * as React from 'react';
import {useIndex} from '@/states/fetched';
import {StyleSheet} from 'react-native';
import {List} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '@/types/navigation';
import FastImage from 'react-native-fast-image';

/*******************************************************************************
 *                                     HOOK                                    *
 *******************************************************************************/

function useHomeCategoriesItem(app: string) {
  const index = useIndex(state => state.index);
  const {navigate} = useNavigation<NavigationProps>();

  const buildAppIcon = React.useCallback(
    () => (
      <FastImage
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

  return {buildAppIcon, handleOnPress};
}

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

export interface HomeItemProps {
  app: string;
}

const HomeCategoriesItem = ({app}: HomeItemProps) => {
  const {buildAppIcon, handleOnPress} = useHomeCategoriesItem(app);

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

/*******************************************************************************
 *                                    STYLES                                   *
 *******************************************************************************/

const styles = StyleSheet.create({
  appIcon: {
    width: 25,
    height: 25,
    borderRadius: 5,
    overflow: 'hidden',
  },
  homeItem: {
    paddingLeft: 25,
    backgroundColor: 'transparent',
    width: '100%',
  },
});

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default React.memo(HomeCategoriesItem);
