import {NavigationProp, RouteProp} from '@react-navigation/native';
import {SettingsSectionItemInferred} from './settings';

/*******************************************************************************
 *                                     APPS                                    *
 *******************************************************************************/

export type AppsStackPage = 'app' | 'apps';

export type AppsStackParams = {
  app: {app: string};
  apps: undefined;
};

/*******************************************************************************
 *                                     TIPS                                    *
 *******************************************************************************/

export type TipsStackPage = 'tip' | 'tips';

export type TipsStackParams = {
  tips: undefined;
  tip: {tip: string} | undefined;
};

/*******************************************************************************
 *                                     MAIN                                    *
 *******************************************************************************/

export type MainStackPage =
  | 'apps-stack'
  | 'downloads'
  | 'loading'
  | 'settings'
  | 'tips-stack'
  | 'updates';

export type MainStackParams = {
  'apps-stack': undefined;
  downloads: undefined | {download: string};
  loading: undefined;
  settings: undefined | {setting: SettingsSectionItemInferred};
  'tips-stack': undefined;
  updates: undefined;
};

/*******************************************************************************
 *                                     ALL                                     *
 *******************************************************************************/

export type Page = AppsStackPage | MainStackPage | TipsStackPage;

export type PageParams = AppsStackParams & MainStackParams & TipsStackParams;

export type NavigationProps = NavigationProp<PageParams>;

export type RouteProps = RouteProp<PageParams>;
