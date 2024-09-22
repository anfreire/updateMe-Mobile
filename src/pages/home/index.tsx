import * as React from 'react';
import LoadingView from '@/components/loadingView';
import HomeBanner from './components/banner';
import HomeSearchFAB from './components/searchFAB';
import {Page} from '@/types/navigation';
import {useCurrPageEffect} from '@/hooks/useCurrPageEffect';
import {useHomeScreen} from './useHomeScreen';

const CURR_PAGE: Page = 'app';

const HomeScreen = () => {
  const {apps, search, setSearch, LayoutComponent} = useHomeScreen();

  useCurrPageEffect(CURR_PAGE);

  if (!LayoutComponent) {
    return <LoadingView />;
  }

  return (
    <>
      <HomeBanner />
      <LayoutComponent apps={apps} />
      <HomeSearchFAB search={search} setSearch={setSearch} />
    </>
  );
};

export default HomeScreen;
