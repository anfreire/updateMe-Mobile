import * as React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useIndex } from "@/states/temporary";
import { useApp } from "@/states/temporary/app";
import Icon from "./icon";
import { NavigationProps } from "@/hooks/navigation";
import { Logger } from "@/states/persistent/logs";

export default function LoadingScreen() {
  const navigation = useNavigation<NavigationProps>();
  const fetchIndex = useIndex((state) => state.fetch);
  const [fetchInfo, getVersion] = useApp((state) => [
    state.fetchInfo,
    state.getVersion,
  ]);

  const fetchData = React.useCallback(
    async (indexFetched = false) => {
      if (!indexFetched && (await fetchIndex()) === null) {
        Logger.error("Failed to fetch index");
        return fetchData(false);
      }

      if ((await fetchInfo()) === null) {
        Logger.error("Failed to fetch info");
        return fetchData(true);
      }

      navigation.reset({
        index: 0,
        routes: [{ name: "home" }],
      });
    },
    [navigation]
  );

  React.useEffect(() => {
    getVersion().then(() => fetchData());
  }, []);

  return (
    <View style={styles.container}>
      <Icon />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
