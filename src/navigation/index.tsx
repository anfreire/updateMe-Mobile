import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from '@/theme';
import LoadingScreen from '@/pages/loading';
import HomeStack from './apps';
import DownloadsScreen from '@/pages/downloads';
import {useTranslations} from '@/states/persistent/translations';
import SettingsScreen from '@/pages/settings';
import UpdatesScreen from '@/pages/updates';
import TipsStack from './tips';
import {MainStackParams} from '@/types/navigation';
import {useBackButton} from './buttons/useBackButton';

const Stack = createStackNavigator<MainStackParams>();

export default function MainStack() {
  const {schemedTheme} = useTheme();
  const translations = useTranslations(state => state.translations);

  const backButton = useBackButton();

  return (
    <Stack.Navigator
      id="main-stack"
      initialRouteName="loading"
      screenOptions={{
        headerStyle: {
          backgroundColor: schemedTheme.surfaceContainer,
        },
        headerTitleStyle: {
          color: schemedTheme.onSurface,
        },
      }}>
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
          headerTitle: translations['Downloads'],
          headerLeft: backButton,
        }}
        component={DownloadsScreen}
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
          headerTitle: translations['Settings'],
          headerLeft: backButton,
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
          headerTitle: translations['Updates'],
          headerLeft: backButton,
        }}
        component={UpdatesScreen}
      />
      <Stack.Screen
        name="tips-stack"
        options={{
          title: translations['Tips'],
        }}
        component={TipsStack}
      />
    </Stack.Navigator>
  );
}
