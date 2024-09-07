import * as React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Logger } from "@/states/persistent/logs";
import { useIndex } from "@/states/fetched";
import { useApp } from "@/states/fetched/app";
import { useCategories } from "@/states/fetched/categories";
import { NavigationProps, Page } from "@/types/navigation";
import LoadingIcon from "./icon";
import { useCurrPageEffect } from "@/hooks/useCurrPageEffect";

const CURR_PAGE: Page = "loading";

const LoadingScreen = () => {
  const { reset } = useNavigation<NavigationProps>();
  const fetchIndex = useIndex((state) => state.fetch);
  const fetchCategories = useCategories((state) => state.fetch);
  const [fetchLatestAppInfo, getLocalVersion] = useApp((state) => [
    state.fetch,
    state.getLocalVersion,
  ]);

  const fetchData = React.useCallback(
    async (indexFetched = false, categoriesFetched = false) => {
      if (!indexFetched && (await fetchIndex()) === null) {
        Logger.error("Failed to fetch index");
        return fetchData(false);
      }

      if (!categoriesFetched && (await fetchCategories()) === null) {
        Logger.error("Failed to fetch categories");
        return fetchData(true);
      }

      if ((await fetchLatestAppInfo()) === null) {
        Logger.error("Failed to fetch info");
        return fetchData(true, true);
      }

      reset({
        index: 0,
        routes: [{ name: "apps" }],
      });
    },
    [reset]
  );

  React.useEffect(() => {
    getLocalVersion().then(() => fetchData());
  }, [fetchData]);

  useCurrPageEffect(CURR_PAGE);

  return (
    <View style={styles.container}>
      <LoadingIcon />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

LoadingScreen.displayName = "LoadingScreen";

export default LoadingScreen;
