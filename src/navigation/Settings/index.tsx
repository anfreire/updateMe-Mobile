import React from 'react';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {SettingsSectionItemInferred} from '@/stores/persistent/settings';
import SettingsScreen from '@/screens/settings';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type SettingsStackPage = 'settings';

export type SettingsStackParams = {
  settings: undefined | {setting: SettingsSectionItemInferred};
};

export type SettingsStackNavigationProps = NavigationProp<SettingsStackPage>;

export type SettingsStackRouteProps = RouteProp<SettingsStackParams>;

export type SettingsStackPageProps<T extends SettingsStackPage> =
  NativeStackScreenProps<SettingsStackParams, T>;

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
      <Stack.Screen name="settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default SettingsNavigator;
