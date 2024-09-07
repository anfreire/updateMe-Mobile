import * as React from "react";
import { Text, TouchableRipple } from "react-native-paper";
import {
  FlatList,
  Dimensions,
  Image,
  ListRenderItem,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/theme";
import ThemedRefreshControl from "@/components/refreshControl";
import { useShallow } from "zustand/react/shallow";
import { useIndex } from "@/states/fetched";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/types/navigation";

const ITEM_MARGIN = 10;
const MIN_ITEM_WIDTH = 125;

function calculateLayout() {
  const screenWidth = Dimensions.get("window").width;
  const columns = Math.floor(
    (screenWidth + ITEM_MARGIN) / (MIN_ITEM_WIDTH + ITEM_MARGIN)
  );
  const itemWidth = (screenWidth - (columns + 1) * ITEM_MARGIN) / columns;
  return { columns, itemWidth };
}

const HomeGrid = ({ apps }: { apps: string[] }) => {
  const theme = useTheme();
  const [index, isIndexFetched, fetchIndex] = useIndex(
    useShallow((state) => [state.index, state.isFetched, state.fetch])
  );

  const [layout, setLayout] = React.useState(calculateLayout);
  const { navigate } = useNavigation<NavigationProps>();

  const themedStyles = React.useMemo(
    () => ({
      backgroundColor: theme.schemedTheme.elevation.level1,
      borderColor: theme.schemedTheme.outlineVariant,
    }),
    [theme]
  );

  React.useEffect(() => {
    const handleLayoutChange = () => {
      const newLayout = calculateLayout();
      setLayout((prev) =>
        JSON.stringify(prev) === JSON.stringify(newLayout) ? prev : newLayout
      );
    };
    const subscription = Dimensions.addEventListener(
      "change",
      handleLayoutChange
    );
    return () => subscription.remove();
  }, [apps.length]);

  const renderItem: ListRenderItem<string> = React.useCallback(
    ({ item: app }) => (
      <TouchableRipple
        onPress={() => navigate("app", { app })}
        style={[styles.item, themedStyles, { width: layout.itemWidth }]}
      >
        <>
          <Image
            resizeMode="contain"
            style={styles.itemIcon}
            source={{ uri: index[app].icon }}
          />
          <Text style={styles.itemTitle}>{app}</Text>
        </>
      </TouchableRipple>
    ),
    [navigate, themedStyles, layout.itemWidth, index]
  );

  return (
    <FlatList
      data={apps}
      renderItem={renderItem}
      keyExtractor={(item) => item}
      numColumns={layout.columns}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      refreshControl={ThemedRefreshControl({
        refreshing: !isIndexFetched,
        onRefresh: fetchIndex,
      })}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: ITEM_MARGIN,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: ITEM_MARGIN,
    marginBottom: ITEM_MARGIN,
  },
  item: {
    aspectRatio: 1,
    gap: 10,
    elevation: 1,
    borderWidth: 1,
    borderRadius: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  itemIcon: {
    width: 40,
    height: 40,
  },
  itemTitle: {
    textAlign: "center",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

HomeGrid.displayName = "HomeGrid";

export default HomeGrid;
