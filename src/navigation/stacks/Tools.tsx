import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {ToolsStackPage, ToolsStackParams} from '@/navigation/types';
import ToolsScreen from '@/screens/Tools';
import FileAnalysisScreen from '@/screens/Tools/screens/FileAnalysis';
import FileFingerprintScreen from '@/screens/Tools/screens/FileFingerprint';
import ProviderStudioScreen from '@/screens/Tools/screens/ProviderStudio';

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
        name="providerStudio"
        navigationKey="providerStudio"
        component={ProviderStudioScreen}
      />
      <Stack.Screen
        name="fileAnalysis"
        navigationKey="fileAnalysis"
        component={FileAnalysisScreen}
      />
      <Stack.Screen
        name="fileFingerprint"
        navigationKey="fileFingerprint"
        component={FileFingerprintScreen}
      />
    </Stack.Navigator>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default ToolsStack;
