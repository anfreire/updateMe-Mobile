import {useCallback} from 'react';
import {useSession} from '@/stores/runtime/session';
import {useFocusEffect} from '@react-navigation/native';
import {Page} from '@/navigation/types';

/******************************************************************************
 *                               HOOK - NORMAL                                *
 ******************************************************************************/

export function useCurrPageEffect(currPage: Page | 'loading') {
  const setCurrPage = useSession(state => state.setCurrPage);

  useFocusEffect(
    useCallback(() => {
      setCurrPage(currPage);
    }, [currPage]),
  );
}
