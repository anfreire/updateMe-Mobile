import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Translation} from '@/stores/persistent/translations';
import SettingsScreen from './screens/Settings';
import SourceColorScreen from './screens/SourceColor';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type SettingsStackPage = 'settings' | 'sourceColor';

export type SettingsStackParams = {
  settings: undefined | {settingTitle: Translation};
  sourceColor: undefined;
};

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const INITIAL_ROUTE_NAME = 'settings' as const;

const SCREEN_OPTIONS = {
  headerShown: false,
} as const;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Stack = createNativeStackNavigator<SettingsStackParams>();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
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

export default SettingsNavigator;
