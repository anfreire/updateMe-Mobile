import * as React from 'react';
import {StyleSheet} from 'react-native';
import ThemedRefreshControl from '@/components/refreshControl';
import {useIndex} from '@/states/fetched';
import {FlashList} from '@shopify/flash-list';
import {useHomeGrid, ITEM_MARGIN} from './useHomeGrid';

const refresh = () => {
  useIndex.getState().fetch();
};

const HomeGrid = ({apps}: {apps: string[]}) => {
  const {renderItem, isIndexFetched, layout} = useHomeGrid();

  return (
    <FlashList
      data={apps}
      renderItem={renderItem}
      keyExtractor={item => item}
      numColumns={layout.columns}
      contentContainerStyle={styles.container}
      refreshControl={ThemedRefreshControl({
        refreshing: !isIndexFetched,
        onRefresh: refresh,
      })}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: ITEM_MARGIN,
    gap: ITEM_MARGIN,
  },
});

HomeGrid.displayName = 'HomeGrid';

export default React.memo(HomeGrid);
