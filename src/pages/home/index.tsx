import {TextInput as RNTextInput, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import React, {useCallback, useEffect, useState} from 'react';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {useTheme} from '@/theme';
import useBackButton from '@/hooks/useBackButton';
import useKeyboard from '@/hooks/useKeyboard';
import {CategoriesProps, IndexProps, useIndex} from '@/states/temporary';
import {CurrAppProps, useCurrApp} from '@/states/computed/currApp';
import {useSettings} from '@/states/persistent/settings';
import HomeBanner from './components/banner';
import {useVersions} from '@/states/computed/versions';
import useScreenCallback from '@/hooks/screenCallback';
import ThemedRefreshControl from '@/components/refreshControl';
import HomeCategories from './components/categories';
import HomeList from './components/list';
import HomeGrid from './components/grid';
import LoadingView from '@/components/loadingView';
import HomeSearchFAB from './components/searchFAB';

export interface HomeScreenChildProps {
  navigation: any;
  route: any;
  index: IndexProps;
  categories: CategoriesProps;
  versions: Record<string, string | null>;
  updates: string[];
  currApp: CurrAppProps | null;
  setCurrApp: (appName: string | null) => void;
  search: string;
  filteredApps: string[];
}

export default function HomeScreen({navigation, route}: any) {
  const theme = useTheme();
  const {isLoaded, index, categories, fetchAll} = useIndex(state => ({
    isLoaded: state.isLoaded,
    index: state.index,
    categories: state.categories,
    fetchAll: state.fetch,
  }));
  const {versions, updates} = useVersions();
  const {currApp, setCurrApp} = useCurrApp();
  const [search, setSearch] = useState<string>('');
  const [appsFiltered, setAppsFiltered] = useState<string[]>([]);
  const homeLayoutType = useSettings(state => state.settings.layout.homeStyle);

  useEffect(() => {
    const sortedApps = Object.keys(index).sort();
    if (search === '') {
      setAppsFiltered(sortedApps);
    } else {
      const terms = search
        .toLowerCase()
        .split(' ')
        .map(term => term.trim().toLowerCase());
      setAppsFiltered(
        sortedApps.filter(app =>
          terms.every(term => app.toLowerCase().includes(term)),
        ),
      );
    }
  }, [search]);

  useScreenCallback({
    initial: () => setCurrApp(null),
  });

  return (
    <>
      {isLoaded ? (
        <>
          <HomeBanner
            route={route}
            navigation={navigation}
            updates={updates}
            versions={versions}
            index={index}
            categories={categories}
            currApp={currApp}
            setCurrApp={setCurrApp}
            search={search}
            filteredApps={appsFiltered}
          />
          <ScrollView
            refreshControl={ThemedRefreshControl(theme, {
              onRefresh: () => {
                fetchAll();
                setSearch('');
              },
              refreshing: !isLoaded,
            })}>
            {homeLayoutType === 'categories' ? (
              <HomeCategories
                route={route}
                navigation={navigation}
                updates={updates}
                versions={versions}
                index={index}
                categories={categories}
                currApp={currApp}
                setCurrApp={setCurrApp}
                search={search}
                filteredApps={appsFiltered}
              />
            ) : homeLayoutType === 'list' ? (
              <HomeList
                route={route}
                navigation={navigation}
                updates={updates}
                versions={versions}
                index={index}
                categories={categories}
                currApp={currApp}
                setCurrApp={setCurrApp}
                search={search}
                filteredApps={appsFiltered}
              />
            ) : (
              <HomeGrid
                route={route}
                navigation={navigation}
                updates={updates}
                versions={versions}
                index={index}
                categories={categories}
                currApp={currApp}
                setCurrApp={setCurrApp}
                search={search}
                filteredApps={appsFiltered}
              />
            )}
          </ScrollView>
          <HomeSearchFAB search={search} setSearch={setSearch} />
        </>
      ) : (
        <LoadingView />
      )}
    </>
  );
}
