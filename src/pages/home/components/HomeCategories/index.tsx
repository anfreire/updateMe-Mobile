import * as React from 'react';
import {useRefreshControlBuilder} from '@/hooks/useRefreshControlBuilder';
import {FlashList} from '@shopify/flash-list';
import HomeCategoriesSection from './HomeCategoriesSection';
import {Categories, useCategories} from '@/states/fetched/categories';
import {useIndex} from '@/states/fetched';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const refresh = () =>
  useIndex.getState().fetch().then(useCategories.getState().fetch);

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

export function useHomeCategories() {
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

  const refreshControl = useRefreshControlBuilder(refresh);

  return {
    openedCategories,
    toggleCategory,
    refreshControl,
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface HomeCategoriesProps {
  filteredCategories: Categories;
  isSearchActive: boolean;
}

const HomeCategories = ({
  filteredCategories,
  isSearchActive,
}: HomeCategoriesProps) => {
  const {openedCategories, toggleCategory, refreshControl} =
    useHomeCategories();

  const renderItem = React.useCallback(
    ({item}: {item: string}) => (
      <HomeCategoriesSection
        key={item}
        title={item}
        category={filteredCategories[item]}
        isExpanded={isSearchActive || openedCategories.has(item)}
        toggleCategory={toggleCategory}
      />
    ),
    [filteredCategories, isSearchActive, openedCategories, toggleCategory],
  );

  return (
    <FlashList
      data={Object.keys(filteredCategories)}
      renderItem={renderItem}
      estimatedItemSize={124}
      refreshControl={refreshControl}
    />
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default HomeCategories;
