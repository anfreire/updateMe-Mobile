import * as React from "react";
import { List } from "react-native-paper";
import { FlatList, Image, ListRenderItem, StyleSheet } from "react-native";
import { useTheme } from "@/theme";
import { useSetCurrApp } from "@/hooks/useSetCurrApp";
import { useIndex } from "@/states/temporary";
import ThemedRefreshControl from "@/components/refreshControl";

const HomeList = ({ apps }: { apps: string[] }) => {
  const theme = useTheme();
  const setCurrApp = useSetCurrApp();
  const [index, isLoaded, fetchIndex] = useIndex((state) => [
    state.index,
    state.isLoaded,
    state.fetch,
  ]);

  const themeStyles = React.useMemo(
    () => ({
      borderColor: theme.schemedTheme.outlineVariant,
      backgroundColor: theme.schemedTheme.elevation.level1,
    }),
    [theme]
  );


  const keyExtractor = React.useCallback((app: string) => app, []);

  return (
    <FlatList
      data={apps}
      keyExtractor={keyExtractor}
      renderItem={({ item: app, index: i }) => (
        <List.Item
          key={app}
          onPress={(_) => setCurrApp(app)}
          title={app}
          style={[
            styles.listItem,
            themeStyles,
            { marginBottom: i === apps.length - 1 ? 10 : 5 },
          ]}
          titleStyle={styles.listItemTitle}
          left={(_) => (
            <Image
              resizeMode="contain"
              style={styles.listItemIcon}
              source={{ uri: index[app].icon }}
            />
          )}
        />
      )}
      refreshControl={ThemedRefreshControl(fetchIndex, !isLoaded)}
    />
  );
};

HomeList.displayName = "HomeList";

export default HomeList;

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
