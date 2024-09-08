import * as React from 'react';
import {FlatList, Image, ListRenderItem, StyleSheet, View} from 'react-native';
import {List} from 'react-native-paper';
import MultiIcon, {MultiIconType} from '@/components/multiIcon';
import ThemedRefreshControl from '@/components/refreshControl';
import {useIndex} from '@/states/fetched';
import {Categories, useCategories} from '@/states/fetched/categories';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '@/types/navigation';
import {useShallow} from 'zustand/react/shallow';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import isEqual from 'react-fast-compare';

const AppIcon = (uri?: string) => () => (
  <Image resizeMode="contain" style={styles.appIcon} source={{uri}} />
);

const CategoryIcon =
  (name: string, type?: MultiIconType) =>
  (props: {color: string; style: Style}) => (
    <MultiIcon
      {...props}
      size={20}
      type={type ?? 'material-community'}
      name={name}
    />
  );

const refresh = () => {
  useIndex.getState().fetch();
  useCategories.getState().fetch();
};

const HomeCategories = ({apps}: {apps: string[]}) => {
  const [index, isIndexFetched] = useIndex(
    useShallow(state => [state.index, state.isFetched]),
  );
  const [categories, isCategoriesFetched] = useCategories(
    useShallow(state => [state.categories, state.isFetched]),
  );
  const [filteredCategories, setFilteredCategories] =
    React.useState<Categories>(categories);
  const [openCategories, setOpenCategories] = React.useState<Set<string>>(
    new Set(),
  );
  const {navigate} = useNavigation<NavigationProps>();

  const indexAppsLength = React.useMemo(
    () => Object.keys(index).length,
    [index],
  );

  const toggleCategory = React.useCallback((category: string) => {
    setOpenCategories(prev => {
      console.log('prev', prev);
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else newSet.add(category);
      console.log('newSet', newSet);
      return newSet;
    });
  }, []);

  React.useEffect(() => {
    if (apps.length === indexAppsLength) {
      setFilteredCategories(prev =>
        isEqual(categories, prev) ? prev : categories,
      );
      return;
    }

    const appsSet = new Set(apps);
    const newCategories = Object.entries(categories).reduce(
      (acc, [category, categoryData]) => {
        const categoryApps = categoryData.apps.filter(app => appsSet.has(app));
        if (categoryApps.length > 0) {
          acc[category] = {...categoryData, apps: categoryApps};
        }
        return acc;
      },
      {} as Categories,
    );

    setFilteredCategories(prev =>
      isEqual(prev, newCategories) ? prev : newCategories,
    );
  }, [apps, categories, indexAppsLength]);

  const renderApp: ListRenderItem<string> = React.useCallback(
    ({item: app}) => (
      <List.Item
        key={app}
        onPress={() => navigate('app', {app})}
        title={app}
        style={styles.appItem}
        left={AppIcon(index[app]?.icon)}
      />
    ),
    [index, navigate],
  );

  const categoryData = React.useMemo(
    () => Object.keys(filteredCategories),
    [filteredCategories],
  );

  console.debug(
    '[src/pages/home/components/layouts/categories.tsx]\nHomeCategories rendered',
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={categoryData}
        renderItem={({item: category}) => (
          <List.Accordion
            id={category}
            title={category}
            expanded={
              openCategories.has(category) || apps.length !== indexAppsLength
            }
            onPress={() => toggleCategory(category)}
            left={CategoryIcon(
              categories[category].icon,
              categories[category].type,
            )}>
            <FlatList
              style={styles.categoryContainer}
              data={filteredCategories[category].apps}
              renderItem={renderApp}
              keyExtractor={app => `home-category-${category}-${app}`}
            />
          </List.Accordion>
        )}
        keyExtractor={item => `home-category-${item}`}
        refreshControl={ThemedRefreshControl({
          onRefresh: refresh,
          refreshing: !isIndexFetched || !isCategoriesFetched,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  categoryContainer: {
    paddingLeft: 0,
  },
  appItem: {
    paddingLeft: 25,
  },
  appIcon: {
    width: 25,
    height: 25,
  },
});

HomeCategories.displayName = 'HomeCategories';

export default HomeCategories;
