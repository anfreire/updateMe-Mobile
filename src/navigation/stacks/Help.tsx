import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {HelpStackPage, HelpStackParams} from '@/navigation/types';
import HelpScreen from '@/screens/Help';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const INITIAL_ROUTE: HelpStackPage = 'help' as const;

const SCREEN_OPTIONS: NativeStackNavigationOptions = {
  headerShown: false,
} as const;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Stack = createNativeStackNavigator<HelpStackParams>();

const ProvidersStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE}
      screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="help" navigationKey="help" component={HelpScreen} />
    </Stack.Navigator>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default ProvidersStack;
