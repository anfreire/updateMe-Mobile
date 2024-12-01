import React, {memo} from 'react';

import {Page, PageProps} from '@/navigation';

import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'tools';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

type ToolsScreenProps = PageProps<typeof CURR_PAGE>;

const ToolsScreen = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  route,
}: ToolsScreenProps) => {
  useCurrPageEffect(CURR_PAGE);
  return <></>;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(ToolsScreen);
