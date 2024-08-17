import { StyleSheet, View } from "react-native";
import React, { useCallback, useMemo } from "react";
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
import { useShallow } from "zustand/react/shallow";

export default function AppScreen({ navigation, route }: any) {
  const [currApp, setCurrApp] = useCurrApp((state) => [
    state.currApp,
    state.setCurrApp,
  ]);
  const theme = useTheme();

  const index = useIndex((state) => state.index);
  const defaultProviders = useDefaultProviders(
    (state) => state.defaultProviders
  );
  const [versions, updates, refreshVersions] = useVersions(
    useShallow((state) => [state.versions, state.updates, state.refresh])
  );

  const refresh = useCallback(() => {
    refreshVersions({ index, defaultProviders });
  }, [index, defaultProviders]);

  useFocusEffect(
    useCallback(() => {
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
      <RelatedAppsBanner
        navigation={navigation}
        route={route}
        index={index}
        versions={versions}
        updates={updates}
        currApp={currApp}
        setCurrApp={setCurrApp}
      />
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
