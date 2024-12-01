import {
  SettingsSection,
  SettingsSectionItem,
} from '@/stores/persistent/settings';
import {NavigationProp, RouteProp} from '@react-navigation/native';

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

export type ToolsStackPage = 'tools' | 'analyze' | 'sha256';

export type ToolsStackParams = {
  tools: undefined | {toolPage: Exclude<ToolsStackPage, 'tools'>};
  analyze: undefined;
  sha256: undefined;
};

export type ToolsStackNavigation = NavigationProp<ToolsStackParams>;

export type ToolsStackRoute = RouteProp<ToolsStackParams>;

/******************************************************************************
 *                               SETTINGS STACK                               *
 ******************************************************************************/

export type SettingsStackPage = 'settings' | 'sourceColor';

export type SettingsStackParams = {
  settings:
    | {
        [K in SettingsSection]: {
          section: K;
          item: SettingsSectionItem<K>;
        };
      }[SettingsSection]
    | undefined;
  sourceColor: undefined;
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
  | 'settings-stack'
  | 'downloads'
  | 'updates';

export type MainStackParams = {
  'home-stack': {
    [K in HomeStackPage]: {
      screen: K;
      params: HomeStackParams[K];
    };
  }[HomeStackPage];
  'providers-stack': {
    [K in ProvidersStackPage]: {
      screen: K;
      params: ProvidersStackParams[K];
    };
  }[ProvidersStackPage];
  'tools-stack': {
    [K in ToolsStackPage]: {
      screen: K;
      params: ToolsStackParams[K];
    };
  }[ToolsStackPage];
  'settings-stack': {
    [K in SettingsStackPage]: {
      screen: K;
      params: SettingsStackParams[K];
    };
  }[SettingsStackPage];
  downloads: undefined;
  updates: undefined;
};

export type MainStackNavigation = NavigationProp<MainStackParams>;

export type MainStackRoute = RouteProp<MainStackParams>;

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type AllPages =
  | HomeStackPage
  | ProvidersStackPage
  | ToolsStackPage
  | SettingsStackPage
  | MainStackPage;

export type Page = Exclude<AllPages, `${string}-stack`>;

export type Stack = Extract<AllPages, `${string}-stack`>;
