import React, {memo} from 'react';

import {Page, PageProps} from '@/navigation';

import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'analyze';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

type AnalyzeScreenProps = PageProps<typeof CURR_PAGE>;

const AnalyzeScreen = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
}: AnalyzeScreenProps) => {
  useCurrPageEffect(CURR_PAGE);
  return <></>;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(AnalyzeScreen);
