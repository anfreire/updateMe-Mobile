import React, {memo} from 'react';
import {PageProps, Page} from '@/navigation';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'updates';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

type UpdatesScreenProps = PageProps<typeof CURR_PAGE>;

const UpdatesScreen = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
}: UpdatesScreenProps) => {
  useCurrPageEffect(CURR_PAGE);
  return <></>;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(UpdatesScreen);
