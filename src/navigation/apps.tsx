import * as React from "react";
import { useGoBack } from "@/hooks/navigation";
import AppScreen from "@/pages/app";
import HomeScreen from "@/pages/home";
import HomeLogo from "@/pages/home/components/logo";
import { useCurrApp } from "@/states/computed/currApp";
import { useDrawer } from "@/states/temporary/drawer";
import { useTheme } from "@/theme";
import { createStackNavigator } from "@react-navigation/stack";
import { useCallback } from "react";
import { IconButton } from "react-native-paper";

export const AppsStackPages = ["app", "home"] as const;

export type AppsStackPage = (typeof AppsStackPages)[number];

export type AppsStackParams = {
  app: undefined;
  home: undefined;
};

const Stack = createStackNavigator<AppsStackParams>();

export default function HomeStack() {
  const { schemedTheme } = useTheme();
  const openDrawer = useDrawer((state) => state.openDrawer);
  const currApp = useCurrApp((state) => state.currApp);

  const goBack = useGoBack();

  return (
    <Stack.Navigator initialRouteName="home" id="home-stack">
      <Stack.Screen
        name="home"
        options={{
          headerStyle: {
            backgroundColor: schemedTheme.surfaceContainer,
          },
          headerTitle: (_) => <HomeLogo />,
          headerRight: () => <IconButton icon="menu" onPress={openDrawer} />,
        }}
        component={HomeScreen}
      />
      <Stack.Screen
        name="app"
        options={{
          headerStyle: {
            backgroundColor: schemedTheme.surfaceContainer,
          },
          headerTitleStyle: {
            color: schemedTheme.onSurface,
          },
          headerTitle: currApp?.name ?? "",
          headerLeft: (_) => <IconButton icon="arrow-left" onPress={goBack} />,
          headerRight: () => <IconButton icon="menu" onPress={openDrawer} />,
        }}
        component={AppScreen}
      />
    </Stack.Navigator>
  );
}
