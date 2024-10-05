import * as React from 'react';
import ThemedRefreshControl from '@/components/refreshControl';
import {useIndex} from '@/states/fetched';
import {useCategories} from '@/states/fetched/categories';
import {FlashList} from '@shopify/flash-list';
import {useHomeCategories} from '../hooks/useHomeCategories';

const refresh = () => {
  useIndex.getState().fetch();
  useCategories.getState().fetch();
};

const HomeCategories = ({apps}: {apps: string[]}) => {
  const isIndexLoaded = useIndex(state => state.isFetched);
  const {indexAppsLength, filteredCategories, renderItem} =
    useHomeCategories(apps);

  return (
    <FlashList
      data={Object.keys(filteredCategories)}
      renderItem={renderItem}
      estimatedItemSize={indexAppsLength}
      keyExtractor={item => item}
      refreshControl={ThemedRefreshControl({
        onRefresh: refresh,
        refreshing: !isIndexLoaded,
      })}
    />
  );
};

export default React.memo(HomeCategories);
