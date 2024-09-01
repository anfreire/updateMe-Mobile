import * as React from "react";
import { Card } from "react-native-paper";
import { ScrollView, StyleSheet, View } from "react-native";
import ProvidersMenu from "./providersMenu";
import ProvidersInfo from "./providersInfo";
import ProvidersDataTable from "./dataTable";
import { CurrAppProps } from "@/hooks/useCurrApp";

interface AppProviderProps {
  currApp: CurrAppProps;
}

const AppProvider = ({ currApp }: AppProviderProps) => {
  const paddingTop = React.useMemo(
    () => (Object.keys(currApp.providers).length > 1 ? 30 : 15),
    [currApp.providers]
  );

  return (
    <Card contentStyle={[style.container, { paddingTop }]}>
      <ProvidersMenu currApp={currApp} />
      <View style={style.view}>
        <ScrollView horizontal={true}>
          <ProvidersDataTable currApp={currApp} />
        </ScrollView>
      </View>
      <ProvidersInfo providers={currApp.providers} />
    </Card>
  );
};

const style = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flexDirection: "column",
    padding: 30,
    gap: 30,
  },
  view: {
    flex: 1,
  },
});

AppProvider.displayName = "AppProvider";

export default React.memo(AppProvider);
