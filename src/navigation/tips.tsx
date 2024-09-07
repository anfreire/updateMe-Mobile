import * as React from "react";
import { useTheme } from "@/theme";
import { createStackNavigator } from "@react-navigation/stack";
import { IconButton } from "react-native-paper";
import TipsScreen from "@/pages/tips";
import TipScreen from "@/pages/tips/tip";
import { useGoBack } from "@/hooks/useGoBack";
import { TipsStackParams } from "@/types/navigation";

const Stack = createStackNavigator<TipsStackParams>();

export default function TipsStack() {
  const { schemedTheme } = useTheme();
  const goBack = useGoBack();

  const headerLeft = React.useCallback(
    () => <IconButton icon="arrow-left" onPress={goBack} />,
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
          headerLeft: headerLeft,
          ...themeOptions,
        }}
        component={TipsScreen}
      />
      <Stack.Screen
        name="tip"
        options={{
          headerTitle: "",
          headerLeft: headerLeft,
          ...themeOptions,
        }}
        component={TipScreen}
      />
    </Stack.Navigator>
  );
}
