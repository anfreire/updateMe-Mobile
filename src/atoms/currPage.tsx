import {useCallback} from 'react';
import {atom, useSetAtom} from 'jotai';
import {Page} from '@/navigation';
import {useFocusEffect} from '@react-navigation/native';

export const currPageAtom = atom<Page>('loading');

export function useCurrPageEffect(page: Page) {
  const setCurrPage = useSetAtom(currPageAtom);

  useFocusEffect(
    useCallback(() => {
      setCurrPage(page);
    }, [page, setCurrPage]),
  );
}
