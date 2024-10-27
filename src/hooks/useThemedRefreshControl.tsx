import * as React from 'react';
import {RefreshControl} from 'react-native';
import {useTheme} from '@/theme';

export function useThemedRefreshControl(
  onRefresh: () => void,
  refreshing: boolean = false,
) {
  const {sourceColor, schemedTheme} = useTheme();

  return React.useMemo(
    () => (
      <RefreshControl
        refreshing={refreshing}
        colors={[sourceColor]}
        progressBackgroundColor={schemedTheme.surfaceBright}
        onRefresh={onRefresh}
      />
    ),
    [sourceColor, schemedTheme, refreshing, onRefresh],
  );
}
