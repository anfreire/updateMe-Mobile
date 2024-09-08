import {NavigationProp, RouteProp} from '@react-navigation/native';

const HOME_PAGE = 'apps' as const;

/*******************************************************************************
 *                                     APPS                                    *
 *******************************************************************************/
export const AppsStackPages = ['app', 'apps'] as const;

export type AppsStackPage = (typeof AppsStackPages)[number];

export type AppsStackParams = {
  app: {app: string};
  apps: undefined;
};

/*******************************************************************************
 *                                     TIPS                                    *
 *******************************************************************************/
export const TipsStackPages = ['tips', 'tip'] as const;

export type TipsStackPage = (typeof TipsStackPages)[number];

export type TipsStackParams = {
  tips: undefined;
  tip: {tip: string} | undefined;
};

/*******************************************************************************
 *                                     MAIN                                    *
 *******************************************************************************/
export const MainStackPages = [
  'loading',
  'apps-stack',
  'downloads',
  'report',
  'settings',
  'updates',
  'tips-stack',
  'suggest',
] as const;

export type MainStackPage = (typeof MainStackPages)[number];

export type MainStackParams = {
  loading: undefined;
  'apps-stack': undefined;
  downloads: undefined;
  report: undefined;
  settings: undefined | {setting: string};
  updates: undefined;
  'tips-stack': undefined;
  suggest: undefined;
};

/*******************************************************************************
 *                                     ALL                                     *
 *******************************************************************************/

export type _Page = AppsStackPage | MainStackPage | TipsStackPage;

export const INITIAL_PAGE: _Page = 'loading' as const;

export const PAGES = [
  ...AppsStackPages,
  ...MainStackPages,
  ...TipsStackPages,
] as const;

export type PagesParams = AppsStackParams & MainStackParams & TipsStackParams;

export type NavigationProps = NavigationProp<PagesParams>;

export type RouteProps = RouteProp<PagesParams>;

export const STACK_PAGES = ['apps-stack', 'tips-stack'] as const;

export type Page = Exclude<_Page, (typeof STACK_PAGES)[number]>;
