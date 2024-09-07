import * as React from "react";
import { List } from "react-native-paper";
import { FlatList, Image, StyleSheet } from "react-native";
import { useTheme } from "@/theme";
import ThemedRefreshControl from "@/components/refreshControl";
import { useShallow } from "zustand/react/shallow";
import { useIndex } from "@/states/fetched";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/types/navigation";

const AppIcon = (uri?: string) => () => (
  <Image resizeMode="contain" style={styles.listItemIcon} source={{ uri }} />
);

const HomeList = ({ apps }: { apps: string[] }) => {
  const theme = useTheme();
  const [index, isIndexFetched, fetchIndex] = useIndex(
    useShallow((state) => [state.index, state.isFetched, state.fetch])
  );
  const { navigate } = useNavigation<NavigationProps>();
  const themeStyles = React.useMemo(
    () => ({
      borderColor: theme.schemedTheme.outlineVariant,
      backgroundColor: theme.schemedTheme.elevation.level1,
    }),
    [theme]
  );

  const getDynamicListItemStyle = (i: number) => ({
    marginBottom: i === apps.length - 1 ? 10 : 5,
  });

  return (
    <FlatList
      data={apps}
      keyExtractor={(app) => app}
      renderItem={({ item: app, index: i }) => (
        <List.Item
          key={app}
          onPress={() => navigate("app", { app })}
          title={app}
          style={[styles.listItem, themeStyles, getDynamicListItemStyle(i)]}
          titleStyle={styles.listItemTitle}
          left={AppIcon(index[app].icon)}
        />
      )}
      refreshControl={ThemedRefreshControl({
        onRefresh: fetchIndex,
        refreshing: !isIndexFetched,
      })}
    />
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingLeft: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderRadius: 20,
    margin: 5,
    marginHorizontal: 10,
    elevation: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  listItemTitle: {
    fontSize: 18,
  },
  listItemIcon: {
    width: 30,
    height: 30,
  },
});

HomeList.displayName = "HomeList";

export default HomeList;
