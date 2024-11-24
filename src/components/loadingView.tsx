import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '@/theme';
import {ActivityIndicator} from 'react-native-paper';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const LoadingView = () => {
  const {sourceColor} = useTheme();
  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={sourceColor} />
    </View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(LoadingView);
