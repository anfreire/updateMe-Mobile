import React, {memo} from 'react';
import {PageProps, Page} from '@/navigation';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';
import {Button} from 'react-native-paper';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'home';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const HomeScreen = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
}: PageProps<typeof CURR_PAGE>) => {
  useCurrPageEffect(CURR_PAGE);
  return (
    <>
      <Button
        onPress={() =>
          navigation.navigate('drawer-stack', {
            screen: 'settings-stack',
            params: {
              screen: 'settings',
              params: {
                settingTitle: 'Source Color',
              },
            },
          })
        }>
        Go
      </Button>
    </>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(HomeScreen);
