import * as React from 'react';
import ThemedRefreshControl from '@/components/refreshControl';
import {useIndex} from '@/states/fetched';
import {FlashList} from '@shopify/flash-list';
import {useHomeList} from './useHomeList';
import {StyleSheet} from 'react-native';
import {useShallow} from 'zustand/react/shallow';

const refresh = () => {
  useIndex.getState().fetch();
};

const HomeList = ({apps}: {apps: string[]}) => {
  const [isIndexFetched, index] = useIndex(
    useShallow(state => [state.isFetched, state.index]),
  );

  const indexAppsLength = Object.keys(index).length;

  const {renderItem} = useHomeList();

  return (
    <FlashList
      style={styles.list}
      data={apps}
      estimatedItemSize={indexAppsLength}
      keyExtractor={app => app}
      renderItem={renderItem}
      refreshControl={ThemedRefreshControl({
        onRefresh: refresh,
        refreshing: !isIndexFetched,
      })}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    padding: 10,
    gap: 10,
  },
});

HomeList.displayName = 'HomeList';

export default React.memo(HomeList);
