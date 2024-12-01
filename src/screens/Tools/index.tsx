import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ToolsScreen from './screens/Tools';
import AnalyzeScreen from './screens/Analyze';
import Sha256Screen from './screens/Sha256';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type ToolsStackPage = 'tools' | 'analyze' | 'sha256';

export type ToolsStackParams = {
  tools: undefined;
  analyze: undefined;
  sha256: undefined;
};

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const INITIAL_ROUTE_NAME: ToolsStackPage = 'tools' as const;

const SCREEN_OPTIONS = {
  headerShown: false,
} as const;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Stack = createNativeStackNavigator<ToolsStackParams>();

const ToolsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
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

export default ToolsNavigator;
