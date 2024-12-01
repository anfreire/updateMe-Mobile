import React, {memo} from 'react';
import {Page, SettingsStackPageProps} from '@/routes';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'settings';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const SettingsScreen = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
}: SettingsStackPageProps<'settings'>) => {
  useCurrPageEffect(CURR_PAGE);
  return <></>;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(SettingsScreen);
