import * as React from 'react';
import {useIndex} from '@/states/fetched';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '@/types/navigation';
import {useTheme} from '@/theme';
import FastImage from 'react-native-fast-image';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useHomeCategoriesItem(app: string) {
  const index = useIndex(state => state.index);
  const {navigate} = useNavigation<NavigationProps>();
  const {schemedTheme} = useTheme();

  const appData = index[app];

  const handleOnPress = React.useCallback(() => {
    navigate('app', {app});
  }, [app, navigate]);

  return {
    appData,
    schemedTheme,
    handleOnPress,
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

export interface HomeItemProps {
  app: string;
}

const HomeCategoriesItem = ({app}: HomeItemProps) => {
  const {appData, schemedTheme, handleOnPress} = useHomeCategoriesItem(app);

  if (!appData) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      style={styles.container}
      activeOpacity={0.6}>
      <View style={styles.iconContainer}>
        <FastImage
          resizeMode="cover"
          style={styles.appIcon}
          source={{uri: appData.icon}}
        />
      </View>

      <Text
        variant="bodyMedium"
        style={[styles.appTitle, {color: schemedTheme.onSurface}]}
        numberOfLines={1}>
        {app}
      </Text>
    </TouchableOpacity>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    overflow: 'hidden',
  },
  appIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  appTitle: {
    flex: 1,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(HomeCategoriesItem);
