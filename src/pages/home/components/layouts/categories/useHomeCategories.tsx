import * as React from 'react';
import {useIndex} from '@/states/fetched';
import {useCategories} from '@/states/fetched/categories';
import HomeCategorySection from './homeCategorySection';

export function useHomeCategories(apps: string[]) {
  const index = useIndex(state => state.index);
  const categories = useCategories(state => state.categories);

  const [openedCategories, setOpenedCategories] = React.useState<Set<string>>(
    new Set(),
  );

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
    return Object.fromEntries(
      Object.entries(categories)
        .filter(([_, categoryData]) =>
          categoryData.apps.some(app => appsSet.has(app)),
        )
        .map(([category, categoryData]) => [
          category,
          {
            ...categoryData,
            apps: categoryData.apps.filter(app => appsSet.has(app)),
          },
        ]),
    );
  }, [apps, categories, indexAppsLength]);

  const renderItem = React.useCallback(
    ({item}: {item: string}) => (
      <HomeCategorySection
        key={item}
        title={item}
        category={filteredCategories[item]}
        expanded={isInSearch || openedCategories.has(item)}
        toggleCategory={toggleCategory}
      />
    ),
    [filteredCategories, openedCategories, toggleCategory, isInSearch],
  );

  return {
    indexAppsLength,
    filteredCategories,
    renderItem,
  };
}
