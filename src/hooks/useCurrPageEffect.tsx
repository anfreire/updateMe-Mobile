import * as React from 'react';
import {NavigationProps, Page} from '@/types/navigation';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSession} from '@/states/runtime/session';
import {useBackButton} from '@/navigation/buttons/useBackButton';
import {useDrawerButton} from '@/navigation/buttons/useDrawerButton';
import {useTranslations} from '@/states/persistent/translations';
import HomeLogo from '@/pages/home/components/HomeLogo';
import {IconButton} from 'react-native-paper';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function buildBackButton(page: Page, navigate: (page: Page) => void) {
  return () => <IconButton icon="arrow-left" onPress={() => navigate(page)} />;
}

/******************************************************************************
 *                               HOOK - NORMAL                                *
 ******************************************************************************/

export function useCurrPageEffect(currPage: Page) {
  const setCurrPage = useSession(state => state.setCurrPage);

  useFocusEffect(
    React.useCallback(() => {
      setCurrPage(currPage);
    }, [currPage]),
  );
}

/******************************************************************************
 *                               HOOK - NESTED                                *
 ******************************************************************************/

export function useNestedCurrPageEffect(
  currPage: Page,
  {tip, app}: {tip?: string; app?: string | null} = {},
) {
  const setCurrPage = useSession(state => state.setCurrPage);
  const {navigate, getParent} = useNavigation<NavigationProps>();
  const translations = useTranslations(state => state.translations);
  const backButton = useBackButton();
  const drawerButton = useDrawerButton();

  const handleNestedNavigation = React.useCallback(
    (page: Page) => {
      if (![page, 'app', 'apps', 'tips'].includes(currPage)) {
        return;
      }

      let title: string | (() => JSX.Element) = '';
      let headerLeft: (() => JSX.Element) | undefined;
      let headerRight: (() => JSX.Element) | undefined;

      switch (currPage) {
        case 'app':
          title = app || '';
          headerLeft = buildBackButton('apps', navigate);
          headerRight = drawerButton;
          break;
        case 'apps':
          title = () => <HomeLogo />;
          headerRight = drawerButton;
          break;
        case 'tips':
          title = translations['Tips'];
          headerLeft = backButton;
          break;
        case 'tip':
          title = tip || '';
          headerLeft = () => (
            <IconButton icon="arrow-left" onPress={() => navigate('tips')} />
          );
          break;
      }

      getParent()?.setOptions({
        headerTitle: title,
        headerLeft,
        headerRight,
      });
    },
    [
      navigate,
      getParent,
      backButton,
      drawerButton,
      translations,
      currPage,
      tip,
      app,
    ],
  );

  useFocusEffect(
    React.useCallback(() => {
      setCurrPage(currPage);
      handleNestedNavigation(currPage);
    }, [currPage, handleNestedNavigation]),
  );

  return null;
}
