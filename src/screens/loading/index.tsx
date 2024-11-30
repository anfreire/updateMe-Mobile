import React, {memo, useEffect} from 'react';
import {View} from 'react-native';
import LoadingIcon from './components/LoadingIcon';
import {useCurrPageEffect} from '@/atoms/currPage';
import {Page, LoadingStackPageProps} from '@/navigation';
import {initTranslations} from '@/translations';
import Signature from './components/Signature';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'loading';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useLoadingScreen(navigation: LoadingScreenProps['navigation']) {
  useEffect(() => {
    initTranslations();

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
