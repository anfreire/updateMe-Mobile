import * as React from 'react';
import ThemedRefreshControl from '@/components/refreshControl';
import {FlashList} from '@shopify/flash-list';
import {useHomeCategories} from './useHomeCategories';
import HomeCategoriesSection from './HomeCategoriesSection';

interface HomeCategoriesProps {
  isRefreshing: boolean;
  apps: string[];
}

const HomeCategories = ({isRefreshing, apps}: HomeCategoriesProps) => {
  const {
    indexAppsLength,
    filteredCategories,
    isInSearch,
    refresh,
    openedCategories,
    toggleCategory,
  } = useHomeCategories(apps, isRefreshing);

  const renderItem = React.useCallback(
    ({item}: {item: string}) => (
      <HomeCategoriesSection
        key={item}
        title={item}
        category={filteredCategories[item]}
        isExpanded={isInSearch || openedCategories.has(item)}
        toggleCategory={toggleCategory}
      />
    ),
    [filteredCategories, isInSearch, openedCategories, toggleCategory],
  );

  return (
    <FlashList
      data={Object.keys(filteredCategories)}
      renderItem={renderItem}
      estimatedItemSize={indexAppsLength}
      keyExtractor={item => item}
      refreshControl={
        <ThemedRefreshControl onRefresh={refresh} refreshing={isRefreshing} />
      }
    />
  );
};

export default React.memo(HomeCategories);
