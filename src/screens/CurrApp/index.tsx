import React, {memo} from 'react';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';
import {Page} from '@/navigation/types';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'currApp';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const CurrAppScreen = () => {
  useCurrPageEffect(CURR_PAGE);
  return <></>;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(CurrAppScreen);