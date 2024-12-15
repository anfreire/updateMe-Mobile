import {
  SettingsSection,
  SettingsSectionItem,
} from '@/stores/persistent/settings';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';

/******************************************************************************
 *                              PROVIDERS STACK                               *
 ******************************************************************************/

export const PROVIDERS_STACK_PAGES = ['providers', 'currProvider'] as const;

export type ProvidersStackPage = (typeof PROVIDERS_STACK_PAGES)[number];

export const PROVIDERS_STACK_INITIAL_ROUTE: ProvidersStackPage = 'providers';

export type ProvidersStackParams = {
  providers: undefined;
  currProvider: {providerId: string};
};

export type ProvidersStackNavigation = NavigationProp<ProvidersStackParams>;

export type ProvidersStackRoute = RouteProp<ProvidersStackParams>;

/******************************************************************************
 *                                TOOLS STACK                                 *
 ******************************************************************************/

export const TOOLS_STACK_PAGES = [
  'tools',
  'fileAnalysis',
  'fileFingerprint',
  'providerStudio',
] as const;

export type ToolsStackPage = (typeof TOOLS_STACK_PAGES)[number];

export const TOOLS_STACK_INITIAL_ROUTE: ToolsStackPage = 'tools';

export type ToolsStackParams = {
  tools: undefined | {item: Exclude<ToolsStackPage, 'tools'>};
  fileAnalysis: undefined | {filePath: string};
  fileFingerprint: undefined | {filePath: string};
  providerStudio: undefined;
};

export type ToolsStackNavigation = NavigationProp<ToolsStackParams>;

export type ToolsStackRoute = RouteProp<ToolsStackParams>;

/******************************************************************************
 *                                 HELP STACK                                 *
 ******************************************************************************/

export const HELP_STACK_PAGES = ['help'] as const;

export type HelpStackPage = (typeof HELP_STACK_PAGES)[number];

export const HELP_STACK_INITIAL_ROUTE: HelpStackPage = 'help';

export type HelpStackParams = {
  help: undefined | {item: Exclude<HelpStackPage, 'help'>};
};

export type HelpStackNavigation = NavigationProp<HelpStackParams>;

export type HelpStackRoute = RouteProp<HelpStackParams>;

/******************************************************************************
 *                               SETTINGS STACK                               *
 ******************************************************************************/

export const SETTINGS_STACK_PAGES = ['settings'] as const;

export type SettingsStackPage = (typeof SETTINGS_STACK_PAGES)[number];

export const SETTINGS_STACK_INITIAL_ROUTE: SettingsStackPage = 'settings';

export type SettingsStackParams = {
  settings:
    | {
        [K in SettingsSection]: {
          section: K;
          item: SettingsSectionItem<K>;
        };
      }[SettingsSection]
    | undefined;
};

export type SettingsStackNavigation = NavigationProp<SettingsStackParams>;

export type SettingsStackRoute = RouteProp<SettingsStackParams>;

/******************************************************************************
 *                                 MAIN STACK                                 *
 ******************************************************************************/

export const MAIN_STACK_PAGES = [
  'home',
  'currApp',
  'providers-stack',
  'tools-stack',
  'help-stack',
  'settings-stack',
  'downloads',
  'updates',
] as const;

export type MainStackPage = (typeof MAIN_STACK_PAGES)[number];

export const MAIN_STACK_INITIAL_ROUTE: MainStackPage = 'home';

type StackParams<P extends string, T extends Record<P, object | undefined>> = {
  [K in P]: {
    screen: K;
    params: T[K];
  };
}[P];

export type MainStackParams = {
  home: undefined;
  currApp: {appId: string};
  'providers-stack': StackParams<ProvidersStackPage, ProvidersStackParams>;
  'tools-stack': StackParams<ToolsStackPage, ToolsStackParams>;
  'help-stack': StackParams<HelpStackPage, HelpStackParams>;
  'settings-stack': StackParams<SettingsStackPage, SettingsStackParams>;
  downloads: undefined;
  updates: undefined;
};

export type MainStackNavigation = DrawerNavigationProp<MainStackParams>;

export type MainStackRoute = RouteProp<MainStackParams>;

/******************************************************************************
 *                                    ALL                                     *
 ******************************************************************************/

export type AllPages =
  | ProvidersStackPage
  | ToolsStackPage
  | HelpStackPage
  | SettingsStackPage
  | MainStackPage;

export const ALL_PAGES: AllPages[] = [
  ...PROVIDERS_STACK_PAGES,
  ...TOOLS_STACK_PAGES,
  ...HELP_STACK_PAGES,
  ...SETTINGS_STACK_PAGES,
  ...MAIN_STACK_PAGES,
] as const;

export type Page = Exclude<AllPages, `${string}-stack`>;

export const PAGES = ALL_PAGES.filter(
  page => !page.endsWith('-stack'),
) as Page[];

export type Stack = Extract<AllPages, `${string}-stack`>;

export const STACKS = ALL_PAGES.filter(page =>
  page.endsWith('-stack'),
) as Stack[];

export const STACK_TO_PAGES: Record<Stack, readonly Page[]> = {
  'providers-stack': PROVIDERS_STACK_PAGES,
  'tools-stack': TOOLS_STACK_PAGES,
  'help-stack': HELP_STACK_PAGES,
  'settings-stack': SETTINGS_STACK_PAGES,
} as const;

export const PAGE_TO_STACK: Record<Page, Stack> = Object.entries(
  STACK_TO_PAGES,
).reduce(
  (acc, [stack, pages]) => {
    (pages as Page[]).forEach(page => {
      acc[page] = stack as Stack;
    });
    return acc;
  },
  {} as Record<Page, Stack>,
);

export const STACK_TO_INITIAL_SCREEN: Record<Stack, Page> = {
  'providers-stack': PROVIDERS_STACK_INITIAL_ROUTE,
  'tools-stack': TOOLS_STACK_INITIAL_ROUTE,
  'help-stack': HELP_STACK_INITIAL_ROUTE,
  'settings-stack': SETTINGS_STACK_INITIAL_ROUTE,
} as const;
