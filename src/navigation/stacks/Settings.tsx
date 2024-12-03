import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {SettingsStackPage, SettingsStackParams} from '@/navigation/types';
import SourceColorScreen from '@/screens/Settings/screens/SourceColor';
import SettingsScreen from '@/screens/Settings';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const INITIAL_ROUTE: SettingsStackPage = 'settings' as const;

const SCREEN_OPTIONS: NativeStackNavigationOptions = {
  headerShown: false,
} as const;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Stack = createNativeStackNavigator<SettingsStackParams>();

const SettingsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE}
      screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen
        name="settings"
        navigationKey="settings"
        component={SettingsScreen}
      />
      <Stack.Screen
        name="sourceColor"
        navigationKey="sourceColor"
        component={SourceColorScreen}
      />
    </Stack.Navigator>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default SettingsStack;
