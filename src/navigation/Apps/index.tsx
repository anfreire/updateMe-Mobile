import React from 'react';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type AppsStackPage = 'apps' | 'app';

export type AppsStackParams = {
  apps: undefined;
  app: {appName: string};
};

export type AppsStackNavigationProps = NavigationProp<AppsStackPage>;

export type AppsStackRouteProps = RouteProp<AppsStackParams>;

export type AppsStackPageProps<T extends AppsStackPage> =
  NativeStackScreenProps<AppsStackParams, T>;

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const INITIAL_ROUTE_NAME = 'apps' as const;

const SCREEN_OPTIONS = {
  headerShown: false,
} as const;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Stack = createNativeStackNavigator<AppsStackParams>();

const TmpComponent = () => <></>;

const AppsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="apps" component={TmpComponent} />
      <Stack.Screen name="app" component={TmpComponent} />
    </Stack.Navigator>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default AppsNavigator;
