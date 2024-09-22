/* eslint-disable react-native/no-unused-styles */
import {HomeLayout} from '@/types/settings';
import * as React from 'react';
import {Image, ImageStyle, StyleSheet} from 'react-native';

const AppIcon = ({homeLayout, uri}: {homeLayout: HomeLayout; uri?: string}) => (
  <Image resizeMode="contain" style={styles[homeLayout]} source={{uri}} />
);

const styles: Record<HomeLayout, ImageStyle> = StyleSheet.create({
  categories: {
    width: 25,
    height: 25,
  },
  list: {
    width: 30,
    height: 30,
  },
  grid: {
    width: 40,
    height: 40,
  },
});

export default React.memo(AppIcon);
