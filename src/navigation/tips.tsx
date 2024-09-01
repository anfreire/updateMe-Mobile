import * as React from "react";
import { useTips } from "@/states/fetched/tips";
import { useTheme } from "@/theme";
import { createStackNavigator } from "@react-navigation/stack";
import { IconButton } from "react-native-paper";
import TipsScreen from "@/pages/tips";
import TipScreen from "@/pages/tips/tip";
import { useSession } from "@/states/runtime/session";
import { useGoBack } from "@/hooks/useGoBack";
import { Page, TipsStackParams } from "@/types/navigation";

const Stack = createStackNavigator<TipsStackParams>();

export default function TipsStack() {
  const { schemedTheme } = useTheme();
  const setCurrPage = useSession((state) => state.setCurrPage);
  const goBack = useGoBack();

  const headerLeft = React.useCallback(
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

  const themeOptions = React.useMemo(
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
          headerTitle: "",
          headerLeft: (_) => headerLeft("tips"),
          ...themeOptions,
        }}
        component={TipScreen}
      />
    </Stack.Navigator>
  );
}
