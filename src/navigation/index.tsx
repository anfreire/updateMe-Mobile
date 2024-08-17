import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@/theme";
import { IconButton } from "react-native-paper";
import LoadingScreen from "@/pages/loading";
import HomeStack from "./apps";
import { useGoBack } from "@/hooks/navigation";
import DownloadsScreen from "@/pages/downloads";
import { useTranslations } from "@/states/persistent/translations";
import ReportScreen from "@/pages/report";
import SettingsScreen from "@/pages/settings";
import UpdatesScreen from "@/pages/updates";
import TipsStack from "./tips";
import SuggestScreen from "@/pages/suggest";

export const MainStackPages = [
  "loading",
  "home",
  "downloads",
  "report",
  "settings",
  "updates",
  "tips",
  "suggest",
] as const;

export type MainStackPage = (typeof MainStackPages)[number];

export type MainStackParams = {
  loading: undefined;
  home: undefined;
  downloads: undefined;
  report: undefined;
  settings: undefined | { setting: string };
  updates: undefined;
  tips: undefined;
  suggest: undefined;
};

const Stack = createStackNavigator<MainStackParams>();

export default function MainStack() {
  const { schemedTheme } = useTheme();
  const goBack = useGoBack();
  const translations = useTranslations();
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
        name="home"
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
          headerLeft: (_) => <IconButton icon="arrow-left" onPress={goBack} />,
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
          headerLeft: (_) => <IconButton icon="arrow-left" onPress={goBack} />,
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
          headerLeft: (_) => <IconButton icon="arrow-left" onPress={goBack} />,
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
          headerLeft: (_) => <IconButton icon="arrow-left" onPress={goBack} />,
        }}
        component={UpdatesScreen}
      />
      <Stack.Screen
        name="tips"
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
          headerLeft: (_) => <IconButton icon="arrow-left" onPress={goBack} />,
        }}
        component={SuggestScreen}
      />
    </Stack.Navigator>
  );
}
