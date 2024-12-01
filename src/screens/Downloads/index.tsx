import React, {memo} from 'react';
import {DrawerStackPageProps, Page} from '@/routes';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'downloads';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const DownloadsScreen = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
}: DrawerStackPageProps<'downloads'>) => {
  useCurrPageEffect(CURR_PAGE);
  return <></>;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(DownloadsScreen);
