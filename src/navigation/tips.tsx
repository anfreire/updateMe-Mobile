import * as React from "react";
import { useTips } from "@/states/temporary/tips";
import { useTheme } from "@/theme";
import { createStackNavigator } from "@react-navigation/stack";
import { IconButton } from "react-native-paper";
import TipsScreen from "@/pages/tips";
import TipScreen from "@/pages/tips/tip";
import { useCallback, useMemo } from "react";
import { Page, useSession } from "@/states/temporary/session";
import { useGoBack } from "@/hooks/navigation";

export const TipsStackPages = ["tips", "tip"] as const;

export type TipsStackPage = (typeof TipsStackPages)[number];

export type TipsStackParams = {
  tips: undefined;
  tip: undefined;
};

const Stack = createStackNavigator<TipsStackParams>();

export default function TipsStack() {
  const { schemedTheme } = useTheme();
  const currTip = useTips((state) => state.currTip);
  const setCurrPage = useSession((state) => state.setCurrPage);
  const goBack = useGoBack();

  const headerLeft = useCallback(
    (page: Page) => (
      <IconButton
        icon="arrow-left"
        onPress={() => {
          setCurrPage(page);
          goBack();
        }}
      />
    ),
    [goBack]
  );

  const themeOptions = useMemo(
    () => ({
      headerStyle: {
        backgroundColor: schemedTheme.surfaceContainer,
      },
      headerTitleStyle: {
        color: schemedTheme.onSurface,
      },
    }),
    [schemedTheme]
  );

  return (
    <Stack.Navigator initialRouteName="tips" id="tips-stack">
      <Stack.Screen
        name="tips"
        options={{
          headerTitle: "Tips",
          headerLeft: (_) => headerLeft("home"),
          ...themeOptions,
        }}
        component={TipsScreen}
      />
      <Stack.Screen
        name="tip"
        options={{
          headerTitle: currTip ?? "",
          headerLeft: (_) => headerLeft("tips"),
          ...themeOptions,
        }}
        component={TipScreen}
      />
    </Stack.Navigator>
  );
}
