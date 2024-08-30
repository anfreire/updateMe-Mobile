import * as React from "react";
import { Text, TouchableRipple } from "react-native-paper";
import {
  Dimensions,
  Image,
  ListRenderItem,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "@/theme";
import { FlatList } from "react-native-gesture-handler";
import { useSetCurrApp } from "@/hooks/useSetCurrApp";
import { useIndex } from "@/states/temporary";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_MARGIN = 10;
const MIN_ITEM_WIDTH = 125;

export default function HomeGrid({ apps }: { apps: string[] }) {
  const theme = useTheme();
  const index = useIndex((state) => state.index);
  const setCurrApp = useSetCurrApp();

  const [layout, setLayout] = React.useState(() => calculateLayout(apps.length));

  const themedStyles = React.useMemo(
    () => ({
      backgroundColor: theme.schemedTheme.elevation.level1,
      borderColor: theme.schemedTheme.outlineVariant,
    }),
    [theme]
  );

  React.useEffect(() => {
    const handleLayoutChange = () => setLayout(calculateLayout(apps.length));
    const subscription = Dimensions.addEventListener("change", handleLayoutChange);
    return () => subscription.remove();
  }, [apps.length]);

  const renderItem: ListRenderItem<string> = React.useCallback(
    ({ item: app }) => (
      <TouchableRipple
        onPress={() => setCurrApp(app)}
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
    [setCurrApp, themedStyles, layout.itemWidth, index]
  );

  return (
    <FlatList
      data={apps}
      renderItem={renderItem}
      keyExtractor={(item) => item}
      numColumns={layout.columns}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
    />
  );
}

function calculateLayout(itemCount: number) {
  const columns = Math.floor((SCREEN_WIDTH + ITEM_MARGIN) / (MIN_ITEM_WIDTH + ITEM_MARGIN));
  const itemWidth = (SCREEN_WIDTH - (columns + 1) * ITEM_MARGIN) / columns;
  return { columns, itemWidth };
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: ITEM_MARGIN,
  },
  row: {
    justifyContent: 'space-between',
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