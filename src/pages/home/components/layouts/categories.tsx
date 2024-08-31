import { FlatList, Image, ListRenderItem, StyleSheet } from "react-native";
import { List } from "react-native-paper";
import MultiIcon from "@/components/multiIcon";
import { CategoriesProps, useIndex } from "@/states/temporary";
import { useSetCurrApp } from "@/hooks/useSetCurrApp";
import ThemedRefreshControl from "@/components/refreshControl";

export default function HomeCategories({ apps }: { apps: string[] }) {
  const [index, categories, isLoaded, fetchIndex] = useIndex((state) => [
    state.index,
    state.categories,
    state.isLoaded,
    state.fetch,
  ]);
  const [filteredCategories, setFilteredCategories] =
    React.useState<CategoriesProps>(categories);
  const [openCategories, setOpenCategories] = React.useState<Set<string>>(
    new Set()
  );
  const setCurrApp = useSetCurrApp();

  const isCategoryOpen = React.useCallback(
    (category: string) =>
      openCategories.has(category) || apps.length === Object.keys(index).length,
    [openCategories, apps, index]
  );

  const toggleCategory = React.useCallback((category: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev);
      newSet.has(category) ? newSet.delete(category) : newSet.add(category);
      return newSet;
    });
  }, []);

  const handleAppsChange = React.useCallback(() => {
    if (apps.length === Object.keys(index).length) {
      setFilteredCategories((prev) =>
        JSON.stringify(prev) === JSON.stringify(categories) ? prev : categories
      );
      return;
    }

    const appsSet = new Set(apps);
    const newCategories = Object.entries(categories).reduce(
      (acc, [category, categoryData]) => {
        const categoryApps = categoryData.apps.filter((app) =>
          appsSet.has(app)
        );
        if (categoryApps.length > 0) {
          acc[category] = { ...categoryData, apps: categoryApps };
        }
        return acc;
      },
      {} as CategoriesProps
    );

    setFilteredCategories((prev) =>
      JSON.stringify(prev) === JSON.stringify(newCategories)
        ? prev
        : newCategories
    );
  }, [apps, categories, index]);

  React.useEffect(() => {
    handleAppsChange();
  }, [handleAppsChange]);

  const renderApp: ListRenderItem<string> = React.useCallback(
    ({ item: app }) => (
      <List.Item
        onPress={() => setCurrApp(app)}
        title={app}
        style={styles.appItem}
        left={() => (
          <Image
            resizeMode="contain"
            style={styles.appIcon}
            source={{ uri: index[app]?.icon }}
          />
        )}
      />
    ),
    [index, setCurrApp]
  );

  const categoryData = React.useMemo(
    () => Object.keys(filteredCategories),
    [filteredCategories]
  );

  return (
    <List.Section>
      <FlatList
        data={categoryData}
        renderItem={({ item: category }) => (
          <List.Accordion
            title={category}
            expanded={isCategoryOpen(category)}
            onPress={() => toggleCategory(category)}
            left={(props) => (
              <MultiIcon
                {...props}
                size={20}
                type={categories[category].type ?? "material-community"}
                name={categories[category].icon}
              />
            )}
          >
            <FlatList
              data={filteredCategories[category].apps}
              renderItem={renderApp}
              keyExtractor={(item) => `home-category-app-${item}`}
            />
          </List.Accordion>
        )}
        keyExtractor={(item) => `home-category-${item}`}
        refreshControl={ThemedRefreshControl(fetchIndex, !isLoaded)}
      />
    </List.Section>
  );
}

const styles = StyleSheet.create({
  appItem: {
    paddingLeft: 25,
  },
  appIcon: {
    width: 25,
    height: 25,
  },
});
