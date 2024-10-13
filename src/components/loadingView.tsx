import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '@/theme';
import {ActivityIndicator} from 'react-native-paper';

const LoadingView = () => {
  const {sourceColor} = useTheme();
  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={sourceColor} />
    </View>
  );
};

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

export default React.memo(LoadingView);
