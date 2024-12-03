import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';
import LoadingIcon from './components/LoadingIcon';
import Signature from './components/Signature';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE = 'loading' as const;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const LoadingScreen = () => {
  useCurrPageEffect(CURR_PAGE);

  return (
    <View style={styles.container}>
      <LoadingIcon />
      <Signature />
    </View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(LoadingScreen);
