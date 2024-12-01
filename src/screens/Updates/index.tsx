import React, {memo} from 'react';
import {DrawerStackPageProps, Page} from '@/routes';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'updates';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const UpdatesScreen = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
}: DrawerStackPageProps<'updates'>) => {
  useCurrPageEffect(CURR_PAGE);
  return <></>;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(UpdatesScreen);
