import * as React from "react";
import ThemedRefreshControl from "@/components/refreshControl";
import { useTips } from "@/states/fetched/tips";
import { FlatList, ListRenderItem, StyleSheet } from "react-native";
import { List } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/types/navigation";
import LoadingView from "@/components/loadingView";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";
import { Page } from "@/types/navigation";
import { useCurrPageEffect } from "@/hooks/useCurrPageEffect";

const CURR_PAGE: Page = "tips";

const chevronRightIcon = (props: { color: string; style?: Style }) => (
  <List.Icon {...props} icon="chevron-right" />
);

const TipsScreen = () => {
  const [tips, isfetched, fetchTips] = useTips((state) => [
    state.tips,
    state.isFetched,
    state.fetch,
  ]);
  const { navigate } = useNavigation<NavigationProps>();

  const renderItem: ListRenderItem<string> = React.useCallback(
    ({ item: tip }) => (
      <List.Item
        title={tip}
        right={chevronRightIcon}
        description={tips[tip].description}
        descriptionStyle={styles.listItem}
        onPress={() => navigate("tip", { tip })}
      />
    ),
    [tips, navigate]
  );

  useCurrPageEffect(CURR_PAGE);

  if (!isfetched) {
    return <LoadingView />;
  }

  return (
    <FlatList
      contentContainerStyle={styles.flatListContainer}
      data={Object.keys(tips)}
      keyExtractor={(item) => item}
      renderItem={renderItem}
      refreshControl={ThemedRefreshControl({
        onRefresh: fetchTips,
        refreshing: !isfetched,
      })}
    />
  );
};

const styles = StyleSheet.create({
  listItem: { fontSize: 13 },
  flatListContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
});

TipsScreen.displayName = "TipsScreen";

export default TipsScreen;
