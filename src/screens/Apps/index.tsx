import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';
import {AppsStackPageProps, Page} from '@/routes';
import React, {memo} from 'react';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'apps';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const AppsScreen = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
}: AppsStackPageProps<'apps'>) => {
  useCurrPageEffect(CURR_PAGE);
  return <></>;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(AppsScreen);
