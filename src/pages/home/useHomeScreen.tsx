import {useIndex} from '@/states/fetched';
import {useCategories} from '@/states/fetched/categories';
import {useSettings} from '@/states/persistent/settings';
import * as React from 'react';
import {useShallow} from 'zustand/react/shallow';
import HomeCategories from '@/pages/home/components/layouts/categories';
import HomeGrid from '@/pages/home/components/layouts/grid';
import HomeList from '@/pages/home/components/layouts/list';

const LayoutComponents = {
  categories: HomeCategories,
  list: HomeList,
  grid: HomeGrid,
} as const;

export function useHomeScreen() {
  const [isIndexLoaded, index] = useIndex(
    useShallow(state => [state.isFetched, state.index]),
  );
  const isCategoriesLoaded = useCategories(state => state.isFetched);
  const homeLayoutType = useSettings(state => state.settings.layout.homeStyle);
  const [search, setSearch] = React.useState<string>('');

  const apps = React.useMemo(() => {
    if (!isIndexLoaded) return [];
    const allApps = Object.keys(index);
    if (search.trim() === '') return allApps;

    const terms = search.toLowerCase().split(' ');
    return allApps
      .filter(app => terms.every(term => app.toLowerCase().includes(term)))
      .sort();
  }, [index, isIndexLoaded, search]);

  const LayoutComponent = React.useMemo(() => {
    if (
      !isIndexLoaded ||
      (homeLayoutType === 'categories' && !isCategoriesLoaded)
    ) {
      return null;
    }
    return LayoutComponents[homeLayoutType];
  }, [homeLayoutType, isIndexLoaded, isCategoriesLoaded]);

  return {
    LayoutComponent,
    search,
    setSearch,
    apps,
  };
}
