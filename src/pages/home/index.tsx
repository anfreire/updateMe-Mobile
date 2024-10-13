import * as React from 'react';
import LoadingView from '@/components/loadingView';
import {Page} from '@/types/navigation';
import {useCurrPageEffect} from '@/hooks/useCurrPageEffect';
import {useIndex} from '@/states/fetched';
import {useCategories} from '@/states/fetched/categories';
import {useShallow} from 'zustand/react/shallow';
import HomeBanner from './components/HomeBanner';
import HomeCategories from './components/HomeCategories';
import HomeSearch from './components/HomeSearch';

const CURR_PAGE: Page = 'app';

/*******************************************************************************
 *                                    LOGIC                                    *
 *******************************************************************************/

const normalizeString = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export function useHomeScreen() {
  const [search, setSearch] = React.useState<string>('');
  const isIndexFetched = useIndex(state => state.isFetched);
  const [categories, isCategoriesFetched] = useCategories(
    useShallow(state => [state.categories, state.isFetched]),
  );

  const isRefreshing = !isIndexFetched || !isCategoriesFetched;
  const isSearchActive = search.trim() !== '';

  const searchTokens = React.useMemo(
    () =>
      isSearchActive
        ? normalizeString(search).split(/\s+/).filter(Boolean)
        : [],
    [search, isSearchActive],
  );

  const filteredCategories = React.useMemo(() => {
    if (isRefreshing) return {};
    if (!isSearchActive) return categories;

    return Object.fromEntries(
      Object.entries(categories).flatMap(([category, info]) => {
        const filteredApps = info.apps.filter(app =>
          searchTokens.every(token => normalizeString(app).includes(token)),
        );
        return filteredApps.length > 0
          ? [[category, {...info, apps: filteredApps}]]
          : [];
      }),
    );
  }, [categories, isRefreshing, isSearchActive, searchTokens]);

  return {search, setSearch, isRefreshing, isSearchActive, filteredCategories};
}

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

const HomeScreen = () => {
  const {search, setSearch, isRefreshing, isSearchActive, filteredCategories} =
    useHomeScreen();

  useCurrPageEffect(CURR_PAGE);

  if (isRefreshing) {
    return <LoadingView />;
  }

  return (
    <>
      <HomeBanner />
      <HomeCategories
        filteredCategories={filteredCategories}
        isSearchActive={isSearchActive}
      />
      <HomeSearch search={search} setSearch={setSearch} />
    </>
  );
};

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default React.memo(HomeScreen);
