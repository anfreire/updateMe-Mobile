import React from 'react';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import LoadingScreen from '@/screens/loading';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import DrawerNavigator from '@/navigation/Drawer';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type LoadingStackPage = 'loading' | 'drawer-stack';

export type LoadingStackParams = {
  loading: undefined;
  'drawer-stack': undefined;
};

export type LoadingStackNavigationProps = NavigationProp<LoadingStackPage>;

export type LoadingStackRouteProps = RouteProp<LoadingStackParams>;

export type LoadingStackPageProps<T extends LoadingStackPage> =
  NativeStackScreenProps<LoadingStackParams, T>;

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const INITIAL_ROUTE_NAME = 'loading' as const;

const SCREEN_OPTIONS = {
  headerShown: false,
} as const;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Stack = createNativeStackNavigator<LoadingStackParams>();

const LoadingNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="loading" component={LoadingScreen} />
      <Stack.Screen name="drawer-stack" component={DrawerNavigator} />
    </Stack.Navigator>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default LoadingNavigator;
