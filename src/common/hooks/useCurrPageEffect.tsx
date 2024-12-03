import React, {useCallback} from 'react';
import {useSession} from '@/stores/runtime/session';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {MainStackNavigation, NestedScreenPage, Page} from '@/navigation/types';
import {Translation} from '@/stores/persistent/translations';
import HomeLogo from '@/navigation/components/HomeLogo';

const NESTED_SCREEN_TO_TITLE: Record<
  NestedScreenPage,
  Translation | (() => React.JSX.Element)
> = {
  home: () => <HomeLogo />,
  settings: 'Settings',
  tools: 'Tools',
  providers: 'Providers',
  analyze: 'File Analysis',
  sha256: 'File Fingerprint',
  sourceColor: 'Source Color',
  currApp: 'App', // TODO: Replace with actual app name
  currProvider: 'Provider', // TODO: Replace with actual provider name
} as const;

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

export function useCurrPageEffect(currPage: Page | 'loading') {
  const setCurrPage = useSession(state => state.setCurrPage);
  const {getParent} = useNavigation<MainStackNavigation>();

  useFocusEffect(
    useCallback(() => {
      setCurrPage(currPage);
      if (currPage in NESTED_SCREEN_TO_TITLE) {
        getParent()?.setOptions({
          headerTitle: NESTED_SCREEN_TO_TITLE[currPage as NestedScreenPage],
        });
      }
    }, [currPage, getParent]),
  );
}
