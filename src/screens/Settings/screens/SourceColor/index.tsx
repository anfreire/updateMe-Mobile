import React, {memo} from 'react';
import {Page, PageProps} from '@/navigation';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'sourceColor';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

type SourceColorScreenProps = PageProps<typeof CURR_PAGE>;

const SourceColorScreen = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
}: SourceColorScreenProps) => {
  useCurrPageEffect(CURR_PAGE);
  return <></>;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(SourceColorScreen);
