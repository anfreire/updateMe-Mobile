import * as React from 'react';
import LoadingView from '@/components/loadingView';
import {useSettings} from '@/states/persistent/settings';
import HomeBanner from './components/banner';
import HomeCategories from './components/layouts/categories';
import HomeSearchFAB from './components/searchFAB';
import HomeList from './components/layouts/list';
import HomeGrid from './components/layouts/grid';
import {useIndex} from '@/states/fetched';
import {useShallow} from 'zustand/react/shallow';
import {useCategories} from '@/states/fetched/categories';
import {Page} from '@/types/navigation';
import {useCurrPageEffect} from '@/hooks/useCurrPageEffect';

const CURR_PAGE: Page = 'app';

const LayoutComponents = {
  categories: HomeCategories,
  list: HomeList,
  grid: HomeGrid,
} as const;

const HomeScreen = () => {
  const [isIndexLoaded, index] = useIndex(
    useShallow(state => [state.isFetched, state.index]),
  );
  const [isCategoriesLoaded] = useCategories(
    useShallow(state => [state.isFetched, state.categories]),
  );
  const [search, setSearch] = React.useState<string>('');
  const [apps, setApps] = React.useState<string[]>([]);
  const homeLayoutType = useSettings(state => state.settings.layout.homeStyle);

  const handleSearchChange = React.useCallback(
    (text: string) => {
      let sortedApps = Object.keys(index).sort();
      if (text.trim() !== '') {
        const terms = text.toLowerCase().split(' ');
        sortedApps = sortedApps.filter(app =>
          terms.every(term => app.toLowerCase().includes(term)),
        );
      }
      setApps(prev =>
        JSON.stringify(prev) === JSON.stringify(sortedApps) ? prev : sortedApps,
      );
    },
    [index],
  );

  React.useEffect(() => {
    handleSearchChange(search);
  }, [handleSearchChange, search]);

  const LayoutComponent = React.useMemo(() => {
    if (
      !isIndexLoaded ||
      (homeLayoutType === 'categories' && !isCategoriesLoaded)
    ) {
      return null;
    }
    return LayoutComponents[homeLayoutType];
  }, [homeLayoutType, isIndexLoaded, isCategoriesLoaded]);

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

HomeScreen.displayName = 'HomeScreen';

export default HomeScreen;
