import React, {memo} from 'react';
import {PageProps, Page} from '@/navigation';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'currApp';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

type CurrAppScreenProps = PageProps<typeof CURR_PAGE>;

const CurrAppScreen = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
}: CurrAppScreenProps) => {
  useCurrPageEffect(CURR_PAGE);
  return <></>;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(CurrAppScreen);