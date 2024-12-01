import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {ToolsStackPage, ToolsStackParams} from '@/navigation/types';
import ToolsScreen from '@/screens/Tools';
import AnalyzeScreen from '@/screens/Tools/screens/Analyze';
import Sha256Screen from '@/screens/Tools/screens/Sha256';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const INITIAL_ROUTE: ToolsStackPage = 'tools' as const;

const SCREEN_OPTIONS: NativeStackNavigationOptions = {
  headerShown: false,
} as const;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Stack = createNativeStackNavigator<ToolsStackParams>();

const ToolsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE}
      screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen
        name="tools"
        navigationKey="tools"
        component={ToolsScreen}
      />
      <Stack.Screen
        name="analyze"
        navigationKey="analyze"
        component={AnalyzeScreen}
      />
      <Stack.Screen
        name="sha256"
        navigationKey="sha256"
        component={Sha256Screen}
      />
    </Stack.Navigator>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default ToolsStack;
