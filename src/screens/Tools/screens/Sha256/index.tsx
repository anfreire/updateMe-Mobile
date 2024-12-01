import React, {memo} from 'react';

import {Page, PageProps} from '@/navigation';

import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'sha256';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

type Sha256ScreenProps = PageProps<typeof CURR_PAGE>;

const Sha256Screen = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
}: Sha256ScreenProps) => {
  useCurrPageEffect(CURR_PAGE);
  return <></>;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(Sha256Screen);
