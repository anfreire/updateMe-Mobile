import {useCallback} from 'react';
import {useSession} from '@/stores/runtime/session';
import {Page} from '@/routes';
import {useFocusEffect} from '@react-navigation/native';

/******************************************************************************
 *                               HOOK - NORMAL                                *
 ******************************************************************************/

export function useCurrPageEffect(currPage: Page) {
  const setCurrPage = useSession(state => state.setCurrPage);

  useFocusEffect(
    useCallback(() => {
      setCurrPage(currPage);
    }, [currPage]),
  );
}
