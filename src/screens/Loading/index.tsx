import React, {memo} from 'react';
import {View} from 'react-native';
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
    <View className="flex-1 justify-center items-center relative">
      <LoadingIcon />
      <Signature />
    </View>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(LoadingScreen);
