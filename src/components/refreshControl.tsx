import * as React from 'react';
import {RefreshControl} from 'react-native';
import {useTheme} from '@/theme';

interface ThemedRefreshControlProps {
  onRefresh: () => void;
  refreshing?: boolean;
}

const ThemedRefreshControl = ({
  onRefresh,
  refreshing = false,
}: ThemedRefreshControlProps) => {
  const {sourceColor, schemedTheme} = useTheme();

  const themeStyles = React.useMemo(
    () => ({
      colors: [sourceColor],
      progressBackgroundColor: schemedTheme.surfaceBright,
    }),
    [sourceColor, schemedTheme],
  );
  return (
    <RefreshControl
      refreshing={refreshing}
      colors={themeStyles.colors}
      progressBackgroundColor={themeStyles.progressBackgroundColor}
      onRefresh={onRefresh}
    />
  );
};

export default ThemedRefreshControl;
