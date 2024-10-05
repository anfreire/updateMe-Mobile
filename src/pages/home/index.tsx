import * as React from 'react';
import LoadingView from '@/components/loadingView';
import HomeBanner from './banner/banner';
import HomeSearchFAB from './search/searchFAB';
import {Page} from '@/types/navigation';
import {useCurrPageEffect} from '@/hooks/useCurrPageEffect';
import {useIndex} from '@/states/fetched';
import {useShallow} from 'zustand/react/shallow';
import HomeCategories from './categories';
import {useCategories} from '@/states/fetched/categories';

const CURR_PAGE: Page = 'app';

const HomeScreen = () => {
  const [isIndexLoaded, index] = useIndex(
    useShallow(state => [state.isFetched, state.index]),
  );
  const isCategoriesLoaded = useCategories(state => state.isFetched);
  const [search, setSearch] = React.useState<string>('');

  const apps = React.useMemo(() => {
    if (!isIndexLoaded) return [];
    const allApps = Object.keys(index);
    if (search.trim() === '') return allApps;

    const terms = search.toLowerCase().split(' ');
    return allApps.filter(app =>
      terms.every(term => app.toLowerCase().includes(term)),
    );
  }, [index, isIndexLoaded, search]);

  useCurrPageEffect(CURR_PAGE);

  if (!isIndexLoaded || !isCategoriesLoaded) {
    return <LoadingView />;
  }

  return (
    <>
      <HomeBanner />
      <HomeCategories apps={apps} />
      <HomeSearchFAB search={search} setSearch={setSearch} />
    </>
  );
};

export default HomeScreen;
