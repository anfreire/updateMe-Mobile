import * as React from "react";
import ThemedRefreshControl from "@/components/refreshControl";
import { useNavigate } from "@/hooks/navigation";
import { useTips } from "@/states/temporary/tips";
import { useTheme } from "@/theme";
import { ScrollView } from "react-native-gesture-handler";
import { List } from "react-native-paper";

export default function TipsScreen() {
  const theme = useTheme();
  const [tips, setCurrTip, refresh] = useTips((state) => [
    state.tips,
    state.setCurrTip,
    state.fetchTips,
  ]);
  const navigate = useNavigate();
  return (
    <ScrollView
      refreshControl={ThemedRefreshControl(theme, { onRefresh: refresh })}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {Object.keys(tips).map((key) => (
        <List.Item
          key={key}
          title={key}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          description={tips[key].description}
          descriptionStyle={{ fontSize: 13 }}
          onPress={() => {
            setCurrTip(key);
            navigate("tip");
          }}
        ></List.Item>
      ))}
    </ScrollView>
  );
}
