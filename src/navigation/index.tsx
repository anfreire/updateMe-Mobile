import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@/theme";
import { IconButton } from "react-native-paper";
import LoadingScreen from "@/pages/loading";
import HomeStack from "./apps";
import DownloadsScreen from "@/pages/downloads";
import { useTranslations } from "@/states/persistent/translations";
import ReportScreen from "@/pages/report";
import SettingsScreen from "@/pages/settings";
import UpdatesScreen from "@/pages/updates";
import TipsStack from "./tips";
import SuggestScreen from "@/pages/suggest";
import { MainStackParams, NavigationProps } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator<MainStackParams>();

export default function MainStack() {
  const { schemedTheme } = useTheme();
  const { goBack } = useNavigation<NavigationProps>();
  const translations = useTranslations((state) => state.translations);

  const headerLeft = React.useCallback(
    () => <IconButton icon="arrow-left" onPress={goBack} />,
    [goBack]
  );

  return (
    <Stack.Navigator id="main-stack" initialRouteName="loading">
      <Stack.Screen
        name="loading"
        options={{
          headerShown: false,
        }}
        component={LoadingScreen}
      />
      <Stack.Screen
        name="apps-stack"
        options={{
          headerShown: false,
        }}
        component={HomeStack}
      />
      <Stack.Screen
        name="downloads"
        options={{
          headerStyle: {
            backgroundColor: schemedTheme.surfaceContainer,
          },
          headerTitleStyle: {
            color: schemedTheme.onSurface,
          },
          headerTitle: translations["Downloads"],
          headerLeft,
        }}
        component={DownloadsScreen}
      />
      <Stack.Screen
        name="report"
        options={{
          headerStyle: {
            backgroundColor: schemedTheme.surfaceContainer,
          },
          headerTitleStyle: {
            color: schemedTheme.onSurface,
          },
          headerTitle: translations["Report"],
          headerLeft,
        }}
        component={ReportScreen}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerStyle: {
            backgroundColor: schemedTheme.surfaceContainer,
          },
          headerTitleStyle: {
            color: schemedTheme.onSurface,
          },
          headerTitle: translations["Settings"],
          headerLeft,
        }}
        component={SettingsScreen}
      />
      <Stack.Screen
        name="updates"
        options={{
          headerStyle: {
            backgroundColor: schemedTheme.surfaceContainer,
          },
          headerTitleStyle: {
            color: schemedTheme.onSurface,
          },
          headerTitle: translations["Updates"],
          headerLeft,
        }}
        component={UpdatesScreen}
      />
      <Stack.Screen
        name="tips-stack"
        options={{
          headerShown: false,
        }}
        component={TipsStack}
      />
      <Stack.Screen
        name="suggest"
        options={{
          headerStyle: {
            backgroundColor: schemedTheme.surfaceContainer,
          },
          headerTitleStyle: {
            color: schemedTheme.onSurface,
          },
          headerTitle: translations["Suggest an App"],
          headerLeft,
        }}
        component={SuggestScreen}
      />
    </Stack.Navigator>
  );
}
