import * as React from 'react';
import LoadingView from '@/components/loadingView';
import {Page} from '@/types/navigation';
import {useCurrPageEffect} from '@/hooks/useCurrPageEffect';
import {useHomeScreen} from './useHomeScreen';
import {HomeBanner} from './banner';
import {HomeCategories} from './categories';
import {HomeSearch} from './search';

const CURR_PAGE: Page = 'app';

const HomeScreen = () => {
  const {apps, search, setSearchDebounced, isRefreshing} = useHomeScreen();

  useCurrPageEffect(CURR_PAGE);

  if (isRefreshing) {
    return <LoadingView />;
  }

  return (
    <>
      <HomeBanner />
      <HomeCategories apps={apps} isRefreshing={isRefreshing} />
      <HomeSearch search={search} setSearch={setSearchDebounced} />
    </>
  );
};

export default React.memo(HomeScreen);
