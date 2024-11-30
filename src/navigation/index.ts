import {
  DrawerStackPage,
  DrawerStackParams,
  DrawerStackNavigationProps,
  DrawerStackRouteProps,
} from './Drawer';
import {
  LoadingStackPage,
  LoadingStackParams,
  LoadingStackNavigationProps,
  LoadingStackRouteProps,
  LoadingStackPageProps,
} from './Loading';
import {
  AppsStackPage,
  AppsStackParams,
  AppsStackNavigationProps,
  AppsStackRouteProps,
} from './Apps';

export type {
  DrawerStackPage,
  DrawerStackParams,
  DrawerStackNavigationProps,
  DrawerStackRouteProps,
  LoadingStackPage,
  LoadingStackParams,
  LoadingStackNavigationProps,
  LoadingStackRouteProps,
  LoadingStackPageProps,
  AppsStackPage,
  AppsStackParams,
  AppsStackNavigationProps,
  AppsStackRouteProps,
};

export type Page = DrawerStackPage | LoadingStackPage | AppsStackPage;
