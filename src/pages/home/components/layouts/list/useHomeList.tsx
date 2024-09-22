import * as React from 'react';
import HomeListItem from './homeListItem';
import {useTheme} from '@/theme';

export function useHomeList() {
  const theme = useTheme();

  const themedStyles = React.useMemo(
    () => ({
      borderColor: theme.schemedTheme.outlineVariant,
      backgroundColor: theme.schemedTheme.elevation.level1,
    }),
    [theme],
  );

  const renderItem = React.useCallback(
    ({item: app}: {item: string; index: number}) => (
      <HomeListItem app={app} themedStyles={themedStyles} />
    ),
    [themedStyles],
  );

  return {
    renderItem,
    themedStyles,
  };
}
