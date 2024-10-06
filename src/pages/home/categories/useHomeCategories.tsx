import * as React from 'react';
import {useIndex} from '@/states/fetched';
import {useCategories} from '@/states/fetched/categories';
import _ from 'lodash';

export function useHomeCategories(apps: string[], isRefreshing: boolean) {
  const [index, fetchIndex] = useIndex(state => [state.index, state.fetch]);
  const [categories, fetchCategories] = useCategories(state => [
    state.categories,
    state.fetch,
  ]);
  const [openedCategories, setOpenedCategories] = React.useState<Set<string>>(
    new Set(),
  );

  const refresh = React.useCallback(() => {
    fetchIndex();
    fetchCategories();
  }, []);

  const indexAppsLength = React.useMemo(
    () => Object.keys(index).length,
    [index],
  );

  const isInSearch = React.useMemo(
    () => apps.length !== indexAppsLength,
    [apps.length, indexAppsLength],
  );

  const filteredCategories = React.useMemo(() => {
    if (indexAppsLength === apps.length) {
      return categories;
    }

    const appsSet = new Set(apps);
    return _.pickBy(categories, categoryData =>
      categoryData.apps.some(app => appsSet.has(app)),
    );
  }, [apps, categories, indexAppsLength]);

  const toggleCategory = React.useCallback((category: string) => {
    setOpenedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }, []);

  return {
    indexAppsLength,
    filteredCategories,
    isInSearch,
    isRefreshing,
    refresh,
    openedCategories,
    toggleCategory,
  };
}
