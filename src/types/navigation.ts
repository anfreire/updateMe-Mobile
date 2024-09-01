import { NavigationProp, RouteProp } from "@react-navigation/native";

/*******************************************************************************
 *                                     APPS                                    *
 *******************************************************************************/
export const AppsStackPages = ["app", "home"] as const;

export type AppsStackPage = (typeof AppsStackPages)[number];

export const AppsPreviousRoutes: Record<AppsStackPage, AppsStackPage | null> = {
  app: "home",
  home: null,
};

export type AppsStackParams = {
  app: { app: string };
  home: undefined;
};

/*******************************************************************************
 *                                     TIPS                                    *
 *******************************************************************************/
export const TipsStackPages = ["tips", "tip"] as const;

export type TipsStackPage = (typeof TipsStackPages)[number];

export const TipsPreviousRoutes: Record<TipsStackPage, TipsStackPage | null> = {
  tip: "tips",
  tips: null,
};

export type TipsStackParams = {
  tips: undefined;
  tip: { tip: string } | undefined;
};

/*******************************************************************************
 *                                     MAIN                                    *
 *******************************************************************************/
export const MainStackPages = [
  "loading",
  "home",
  "downloads",
  "report",
  "settings",
  "updates",
  "tips",
  "suggest",
] as const;

export type MainStackPage = (typeof MainStackPages)[number];

export const MainPreviousRoutes: Record<MainStackPage, MainStackPage | null> = {
  downloads: "home",
  home: null,
  loading: null,
  report: "home",
  settings: "home",
  suggest: "home",
  tips: "home",
  updates: "home",
};

export type MainStackParams = {
  loading: undefined;
  home: undefined;
  downloads: undefined;
  report: undefined;
  settings: undefined | { setting: string };
  updates: undefined;
  tips: undefined;
  suggest: undefined;
};

/*******************************************************************************
 *                                     ALL                                     *
 *******************************************************************************/

export type Page = AppsStackPage | MainStackPage | TipsStackPage;

export const INITIAL_PAGE: Page = "loading" as const;

export const PAGES = [
  ...AppsStackPages,
  ...MainStackPages,
  ...TipsStackPages,
] as const;

export const PREVIOUS_ROUTES = {
  ...AppsPreviousRoutes,
  ...MainPreviousRoutes,
  ...TipsPreviousRoutes,
};

export type PagesParams = AppsStackParams & MainStackParams & TipsStackParams;

export type NavigationProps = NavigationProp<PagesParams>;

export type RouteProps = RouteProp<PagesParams>;
