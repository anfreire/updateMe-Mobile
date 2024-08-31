import * as React from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import RelatedAppsBanner from "@/pages/app/components/relatedAppsBanner";
import { useTheme } from "@/theme";
import ThemedRefreshControl from "@/components/refreshControl";
import AppLogo from "@/pages/app/components/logo";
import AppInfo from "@/pages/app/components/info";
import AppFeatures from "@/pages/app/components/features";
import AppProvider from "@/pages/app/components/providers";
import { useIndex } from "@/states/temporary";
import { useCurrApp } from "@/states/computed/currApp";
import { useVersions } from "@/states/computed/versions";
import { useFocusEffect } from "@react-navigation/native";
import { useDefaultProviders } from "@/states/persistent/defaultProviders";

export default function AppScreen() {
  const currApp = useCurrApp((state) => state.currApp);
  const theme = useTheme();

  const index = useIndex((state) => state.index);
  const defaultProviders = useDefaultProviders(
    (state) => state.defaultProviders
  );
  const refreshVersions = useVersions((state) => state.refresh);

  const refresh = React.useCallback(() => {
    refreshVersions({ index, defaultProviders });
  }, [index, defaultProviders]);

  useFocusEffect(
    React.useCallback(() => {
      const interval: NodeJS.Timeout = setInterval(refresh, 2500);

      return () => {
        clearInterval(interval);
      };
    }, [])
  );

  if (!currApp) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.sourceColor} />
      </View>
    );
  }

  return (
    <>
      <RelatedAppsBanner currApp={currApp} />
      <ScrollView
        refreshControl={ThemedRefreshControl(theme, {
          refreshing: false,
          onRefresh: refresh,
        })}
      >
        <View style={styles.contentContainer}>
          <AppLogo currApp={currApp} />
          <AppInfo currApp={currApp} />
          <AppFeatures currApp={currApp} />
          <AppProvider currApp={currApp} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
});
