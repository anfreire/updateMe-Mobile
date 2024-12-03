import React, {memo} from 'react';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';
import {Page} from '@/navigation/types';
import {useNavigate} from '@/common/hooks/useNavigate';
import {Button} from 'react-native-paper';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'home';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const HomeScreen = () => {
  const navigate = useNavigate();
  useCurrPageEffect(CURR_PAGE);
  return (
    <>
      <Button
        onPress={() => {
          navigate({
            stack: 'settings-stack',
            screen: 'settings',
            params: {
              section: 'appearance',
              item: 'colorScheme',
            },
          });
        }}>
        Test
      </Button>
    </>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(HomeScreen);
