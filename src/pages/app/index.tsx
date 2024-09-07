import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import RelatedAppsBanner from "@/pages/app/components/relatedAppsBanner";
import { useTheme } from "@/theme";
import ThemedRefreshControl from "@/components/refreshControl";
import AppLogo from "@/pages/app/components/logo";
import AppInfo from "@/pages/app/components/info";
import AppFeatures from "@/pages/app/components/features";
import AppProvider from "@/pages/app/components/providers";
import { useVersions } from "@/states/computed/versions";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useDefaultProviders } from "@/states/persistent/defaultProviders";
import { NavigationProps, Page, RouteProps } from "@/types/navigation";
import { useIndex } from "@/states/fetched";
import { useCurrApp } from "@/hooks/useCurrApp";
import { useCurrPageEffect } from "@/hooks/useCurrPageEffect";

const CURR_PAGE: Page = "app";

const AppScreen = () => {
  const theme = useTheme();
  const { setOptions } = useNavigation<NavigationProps>();
  const { params } = useRoute<RouteProps>();
  const index = useIndex((state) => state.index);
  const populatedDefaultProviders = useDefaultProviders(
    (state) => state.populatedDefaultProviders
  );
  const refreshVersions = useVersions((state) => state.refresh);

  const appTitle = React.useMemo(() => {
    return params && "app" in params ? params.app : null;
  }, [params]);

  const refresh = React.useCallback(() => {
    refreshVersions(index, populatedDefaultProviders);
  }, [index, populatedDefaultProviders]);

  const currApp = useCurrApp(appTitle);

  React.useEffect(() => {
    if (!appTitle) {
      return;
    }
    setOptions({ title: appTitle });
  }, [appTitle, setOptions]);

  useFocusEffect(
    React.useCallback(() => {
      const interval: NodeJS.Timeout = setInterval(refresh, 2500);

      return () => {
        clearInterval(interval);
      };
    }, [refresh])
  );

  useCurrPageEffect(CURR_PAGE);

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
        refreshControl={ThemedRefreshControl({
          refreshing: false,
          onRefresh: refresh,
        })}
      >
        <View style={styles.contentContainer}>
          <AppLogo title={currApp.title} icon={currApp.icon} />
          <AppInfo currApp={currApp} />
          <AppFeatures features={currApp.features} />
          <AppProvider currApp={currApp} />
        </View>
      </ScrollView>
    </>
  );
};

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

AppScreen.displayName = "AppScreen";

export default AppScreen;
