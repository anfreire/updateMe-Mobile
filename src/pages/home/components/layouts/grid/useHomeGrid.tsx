import * as React from 'react';
import {useIndex} from '@/states/fetched';
import {useTheme} from '@/theme';
import {Dimensions} from 'react-native';
import isEqual from 'lodash/isEqual';
import HomeGridItem from './homeGridItem';

export const ITEM_MARGIN = 10;
export const MIN_ITEM_WIDTH = 125;

function calculateLayout() {
  const screenWidth = Dimensions.get('window').width;
  const columns = Math.floor(
    (screenWidth + ITEM_MARGIN) / (MIN_ITEM_WIDTH + ITEM_MARGIN),
  );
  const itemWidth = (screenWidth - (columns + 1) * ITEM_MARGIN) / columns;
  return {columns, itemWidth};
}

export function useHomeGrid() {
  const theme = useTheme();
  const isIndexFetched = useIndex(state => state.index);

  const [layout, setLayout] = React.useState(calculateLayout);

  const themedStyles = React.useMemo(
    () => ({
      backgroundColor: theme.schemedTheme.elevation.level1,
      borderColor: theme.schemedTheme.outlineVariant,
    }),
    [theme],
  );

  React.useEffect(() => {
    const handleLayoutChange = () => {
      const newLayout = calculateLayout();
      setLayout(prev => (isEqual(prev, newLayout) ? prev : newLayout));
    };
    const subscription = Dimensions.addEventListener(
      'change',
      handleLayoutChange,
    );
    return () => subscription.remove();
  }, []);

  const renderItem = React.useCallback(
    ({item}: {item: string}) => (
      <HomeGridItem
        app={item}
        themedStyles={themedStyles}
        itemWidth={layout.itemWidth}
      />
    ),
    [themedStyles, layout.itemWidth],
  );

  return {
    layout,
    renderItem,
    isIndexFetched,
  };
}
