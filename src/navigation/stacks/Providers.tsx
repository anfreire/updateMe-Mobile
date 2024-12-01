import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {ProvidersStackPage, ProvidersStackParams} from '@/navigation/types';
import ProvidersScreen from '@/screens/Providers';
import CurrProviderScreen from '@/screens/Providers/screens/CurrProvider';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const INITIAL_ROUTE: ProvidersStackPage = 'providers' as const;

const SCREEN_OPTIONS: NativeStackNavigationOptions = {
  headerShown: false,
} as const;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Stack = createNativeStackNavigator<ProvidersStackParams>();

const ProvidersStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE}
      screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen
        name="providers"
        navigationKey="providers"
        component={ProvidersScreen}
      />
      <Stack.Screen
        name="currProvider"
        navigationKey="currProvider"
        component={CurrProviderScreen}
      />
    </Stack.Navigator>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default ProvidersStack;
