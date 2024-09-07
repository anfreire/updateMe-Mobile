import * as React from "react";
import { FlatList, Image, ListRenderItem, StyleSheet } from "react-native";
import { List } from "react-native-paper";
import MultiIcon, { MultiIconType } from "@/components/multiIcon";
import ThemedRefreshControl from "@/components/refreshControl";
import { useIndex } from "@/states/fetched";
import { Categories, useCategories } from "@/states/fetched/categories";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/types/navigation";
import { useShallow } from "zustand/react/shallow";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";

const AppIcon = (uri?: string) => () => (
  <Image resizeMode="contain" style={styles.appIcon} source={{ uri }} />
);

const CategoryIcon =
  (name: string, type?: MultiIconType) =>
  (props: { color: string; style: Style }) => (
    <MultiIcon
      {...props}
      size={20}
      type={type ?? "material-community"}
      name={name}
    />
  );

const HomeCategories = ({ apps }: { apps: string[] }) => {
  const [index, isIndexFetched, fetchIndex] = useIndex(
    useShallow((state) => [state.index, state.isFetched, state.fetch])
  );
  const [categories, isCategoriesFetched, fetchCategories] = useCategories(
    useShallow((state) => [state.categories, state.isFetched, state.fetch])
  );
  const [filteredCategories, setFilteredCategories] =
    React.useState<Categories>(categories);
  const [openCategories, setOpenCategories] = React.useState<Set<string>>(
    new Set()
  );
  const { navigate } = useNavigation<NavigationProps>();

  const refresh = React.useCallback(() => {
    fetchIndex();
    fetchCategories();
  }, []);

  const isCategoryOpen = React.useCallback(
    (category: string) =>
      openCategories.has(category) || apps.length === Object.keys(index).length,
    [openCategories, apps, index]
  );

  const toggleCategory = React.useCallback((category: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) newSet.delete(category);
      else newSet.add(category);
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
      {} as Categories
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
        onPress={() => navigate("app", { app })}
        title={app}
        style={styles.appItem}
        left={AppIcon(index[app]?.icon)}
      />
    ),
    [index, navigate]
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
            left={CategoryIcon(
              categories[category].icon,
              categories[category].type
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
        refreshControl={ThemedRefreshControl({
          onRefresh: refresh,
          refreshing: !isIndexFetched || !isCategoriesFetched,
        })}
      />
    </List.Section>
  );
};

const styles = StyleSheet.create({
  appItem: {
    paddingLeft: 25,
  },
  appIcon: {
    width: 25,
    height: 25,
  },
});

HomeCategories.displayName = "HomeCategories";

export default HomeCategories;
