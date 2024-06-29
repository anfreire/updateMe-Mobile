import {RefreshControl} from 'react-native';
import {useThemeProps} from '@/theme';

interface ThemedRefreshControlProps {
  onRefresh: () => void;
  refreshing?: boolean;
}

export default function ThemedRefreshControl(
  theme: useThemeProps,
  {onRefresh, refreshing = false}: ThemedRefreshControlProps,
) {
  return (
    <RefreshControl
      refreshing={refreshing}
      colors={[theme.sourceColor]}
      progressBackgroundColor={theme.schemedTheme.surfaceBright}
      onRefresh={onRefresh}
    />
  );
}
