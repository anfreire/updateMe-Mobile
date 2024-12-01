import React, {memo} from 'react';
import {PageProps, Page} from '@/navigation';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'providers';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

type ProvidersScreenProps = PageProps<typeof CURR_PAGE>;

const ProvidersScreen = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
}: ProvidersScreenProps) => {
  useCurrPageEffect(CURR_PAGE);
  return <></>;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(ProvidersScreen);
