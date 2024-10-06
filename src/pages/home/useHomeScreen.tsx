import * as React from 'react';
import {useIndex} from '@/states/fetched';
import {useCategories} from '@/states/fetched/categories';
import {useShallow} from 'zustand/react/shallow';
import _ from 'lodash';

export function useHomeScreen() {
  const [isIndexFetched, index] = useIndex(
    useShallow(state => [state.isFetched, state.index]),
  );
  const [search, setSearch] = React.useState<string>('');
  const isCategoriesFetched = useCategories(state => state.isFetched);

  const isRefreshing = React.useMemo(
    () => !isIndexFetched || !isCategoriesFetched,
    [isIndexFetched, isCategoriesFetched],
  );

  const apps = React.useMemo(() => {
    if (isRefreshing) return [];
    const allApps = Object.keys(index);
    if (search.trim() === '') return allApps;

    const terms = search.toLowerCase().split(' ');
    return allApps.filter(app =>
      terms.every(term => app.toLowerCase().includes(term)),
    );
  }, [index, isRefreshing, search]);

  // eslint-disable-next-line local-rules/exhaustive-deps
  const setSearchDebounced = React.useCallback(
    _.debounce((value: string) => {
      setSearch(value);
    }, 300),
    [],
  );

  return {apps, search, setSearchDebounced, isRefreshing};
}
