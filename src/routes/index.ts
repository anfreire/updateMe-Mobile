/******************************************************************************
 *                               LOADING STACK                                *
 ******************************************************************************/

import {
  LoadingStackPage,
  LoadingStackParams,
  LoadingStackNavigationProps,
  LoadingStackRouteProps,
  LoadingStackPageProps,
} from './Loading';

export type {
  LoadingStackPage,
  LoadingStackParams,
  LoadingStackNavigationProps,
  LoadingStackRouteProps,
  LoadingStackPageProps,
};

/******************************************************************************
 *                                DRAWER STACK                                *
 ******************************************************************************/

import {
  DrawerStackPage,
  DrawerStackParams,
  DrawerStackNavigationProps,
  DrawerStackRouteProps,
  DrawerStackPageProps,
} from './Drawer';

export type {
  DrawerStackPage,
  DrawerStackParams,
  DrawerStackNavigationProps,
  DrawerStackRouteProps,
  DrawerStackPageProps,
};

/******************************************************************************
 *                                 APPS STACK                                 *
 ******************************************************************************/

import {
  AppsStackPage,
  AppsStackParams,
  AppsStackNavigationProps,
  AppsStackRouteProps,
  AppsStackPageProps,
} from './Apps';

export type {
  AppsStackPage,
  AppsStackParams,
  AppsStackNavigationProps,
  AppsStackRouteProps,
  AppsStackPageProps,
};

/******************************************************************************
 *                               SETTINGS STACK                               *
 ******************************************************************************/

import {
  SettingsStackPage,
  SettingsStackParams,
  SettingsStackNavigationProps,
  SettingsStackRouteProps,
  SettingsStackPageProps,
} from './Settings';

export type {
  SettingsStackPage,
  SettingsStackParams,
  SettingsStackNavigationProps,
  SettingsStackRouteProps,
  SettingsStackPageProps,
};

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type Route =
  | DrawerStackPage
  | LoadingStackPage
  | AppsStackPage
  | SettingsStackPage;

export type Page = Exclude<Route, `${string}-stack`>;

export type Stack = Exclude<Route, Page>;
