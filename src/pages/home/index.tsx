import * as React from "react";
import LoadingView from "@/components/loadingView";
import { useIndex } from "@/states/temporary";
import { useSettings } from "@/states/persistent/settings";
import HomeBanner from "./components/banner";
import HomeCategories from "./components/layouts/categories";
import HomeSearchFAB from "./components/searchFAB";
import HomeList from "./components/layouts/list";
import HomeGrid from "./components/layouts/grid";

const LayoutComponents = {
  categories: HomeCategories,
  list: HomeList,
  grid: HomeGrid,
} as const;

const HomeScreen = () => {
  const [isLoaded, index] = useIndex((state) => [
    state.isLoaded,
    state.index,
    state.categories,
  ]);
  const [search, setSearch] = React.useState<string>("");
  const [apps, setApps] = React.useState<string[]>([]);
  const homeLayoutType = useSettings(
    (state) => state.settings.layout.homeStyle
  );

  const handleSearchChange = React.useCallback(
    (text: string) => {
      let sortedApps = Object.keys(index).sort();
      if (text.trim() !== "") {
        const terms = text.toLowerCase().split(" ");
        sortedApps = sortedApps.filter((app) =>
          terms.every((term) => app.toLowerCase().includes(term))
        );
      }
      setApps((prev) =>
        JSON.stringify(prev) === JSON.stringify(sortedApps) ? prev : sortedApps
      );
    },
    [index]
  );

  React.useEffect(() => {
    handleSearchChange(search);
  }, [handleSearchChange, search]);

  const LayoutComponent = React.useMemo(
    () => LayoutComponents[homeLayoutType],
    [homeLayoutType]
  );

  if (!isLoaded) {
    return <LoadingView />;
  }

  return (
    <>
      <HomeBanner />
      <LayoutComponent apps={apps} />
      <HomeSearchFAB search={search} setSearch={setSearch} />
    </>
  );
};

HomeScreen.displayName = "HomeScreen";

export default HomeScreen;
