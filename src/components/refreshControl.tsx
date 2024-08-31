import * as React from "react";
import { RefreshControl } from "react-native";
import { useTheme } from "@/theme";

export default function ThemedRefreshControl(
  onRefresh: () => void,
  refreshing = false
) {
  const theme = useTheme();

  const themeStyles = React.useMemo(
    () => ({
      colors: [theme.sourceColor],
      progressBackgroundColor: theme.schemedTheme.surfaceBright,
    }),
    [theme]
  );
  return (
    <RefreshControl
      refreshing={refreshing}
      colors={themeStyles.colors}
      progressBackgroundColor={themeStyles.progressBackgroundColor}
      onRefresh={onRefresh}
    />
  );
}
