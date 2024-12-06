import {
  SettingsSection,
  SettingsSectionItem,
} from '@/stores/persistent/settings';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';

/******************************************************************************
 *                                 HOME STACK                                 *
 ******************************************************************************/

export type HomeStackPage = 'home' | 'currApp';

export type HomeStackParams = {
  home: undefined;
  currApp: {appId: string};
};

export type HomeStackNavigation = NavigationProp<HomeStackParams>;

export type HomeStackRoute = RouteProp<HomeStackParams>;

/******************************************************************************
 *                              PROVIDERS STACK                               *
 ******************************************************************************/

export type ProvidersStackPage = 'providers' | 'currProvider';

export type ProvidersStackParams = {
  providers: undefined;
  currProvider: {providerId: string};
};

export type ProvidersStackNavigation = NavigationProp<ProvidersStackParams>;

export type ProvidersStackRoute = RouteProp<ProvidersStackParams>;

/******************************************************************************
 *                                TOOLS STACK                                 *
 ******************************************************************************/

export type ToolsStackPage =
  | 'tools'
  | 'fileAnalysis'
  | 'fileFingerprint'
  | 'providerStudio';

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
export type HelpStackPage = 'help';

export type HelpStackParams = {
  help: undefined | {item: Exclude<HelpStackPage, 'help'>};
};

/******************************************************************************
 *                               SETTINGS STACK                               *
 ******************************************************************************/

export type SettingsStackPage = 'settings';

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

export type MainStackPage =
  | 'home-stack'
  | 'providers-stack'
  | 'tools-stack'
  | 'help-stack'
  | 'settings-stack'
  | 'downloads'
  | 'updates';

type StackParams<P extends string, T extends Record<P, object | undefined>> = {
  [K in P]: {
    screen: K;
    params: T[K];
  };
}[P];

export type MainStackParams = {
  'home-stack': StackParams<HomeStackPage, HomeStackParams>;
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
 *                                   TYPES                                    *
 ******************************************************************************/

export type AllPages =
  | HomeStackPage
  | ProvidersStackPage
  | ToolsStackPage
  | HelpStackPage
  | SettingsStackPage
  | MainStackPage;

export type Page = Exclude<AllPages, `${string}-stack`>;

export type Stack = Extract<AllPages, `${string}-stack`>;

export type NestedScreenPage = Exclude<AllPages, MainStackPage>;
