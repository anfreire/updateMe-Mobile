import React, {memo} from 'react';
import {PageProps, Page} from '@/navigation';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'downloads';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

type DownloadsScreenProps = PageProps<typeof CURR_PAGE>;

const DownloadsScreen = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
}: DownloadsScreenProps) => {
  useCurrPageEffect(CURR_PAGE);
  return <></>;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(DownloadsScreen);
