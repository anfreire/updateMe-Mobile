import React, {memo, useEffect} from 'react';
import {View} from 'react-native';
import LoadingIcon from './components/LoadingIcon';
import {Page, LoadingStackPageProps} from '@/routes';
import Signature from './components/Signature';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'loading';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useLoadingScreen(navigation: LoadingScreenProps['navigation']) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('drawer-stack');
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigation]);

  useCurrPageEffect(CURR_PAGE);
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

type LoadingScreenProps = LoadingStackPageProps<'loading'>;

const LoadingScreen = ({navigation}: LoadingScreenProps) => {
  useLoadingScreen(navigation);

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
