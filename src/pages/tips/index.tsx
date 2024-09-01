import * as React from "react";
import ThemedRefreshControl from "@/components/refreshControl";
import { useTips } from "@/states/fetched/tips";
import { useTheme } from "@/theme";
import { FlatList, ListRenderItem, ScrollView } from "react-native";
import { List } from "react-native-paper";
import { useNavigate } from "@/hooks/useNavigate";
import LoadingView from "@/components/loadingView";

export default function TipsScreen() {
  const [tips, isfetched, fetchTips] = useTips((state) => [
    state.tips,
    state.isFetched,
    state.fetch,
  ]);
  const navigate = useNavigate();

  const renderItem: ListRenderItem<string> = React.useCallback(
    ({ item: tip }) => (
      <List.Item
        title={tip}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        description={tips[tip].description}
        descriptionStyle={{ fontSize: 13 }}
        onPress={() => navigate("tip", { params: { tip } })}
      />
    ),
    []
  );

  if (!isfetched) {
    return <LoadingView />;
  }

  return (
    <FlatList
      contentContainerStyle={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      data={Object.keys(tips)}
      keyExtractor={(item) => item}
      renderItem={renderItem}
      refreshControl={ThemedRefreshControl({
        onRefresh: fetchTips,
        refreshing: !isfetched,
      })}
    />
  );
}
