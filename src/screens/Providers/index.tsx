import React, {memo} from 'react';
import {DrawerStackPageProps, Page} from '@/routes';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'providers';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const ProvidersScreen = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
}: DrawerStackPageProps<'providers'>) => {
  useCurrPageEffect(CURR_PAGE);
  return <></>;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(ProvidersScreen);
