import * as React from "react";
import { Card } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ProvidersMenu from "./providersMenu";
import { CurrAppProps } from "@/states/computed/currApp";
import ProvidersInfo from "./providersInfo";
import ProvidersDataTable from "./dataTable";
export default function AppProvider({ currApp }: { currApp: CurrAppProps }) {
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
      <ProvidersInfo currApp={currApp} />
    </Card>
  );
}

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
