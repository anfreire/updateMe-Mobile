import React, {useMemo} from 'react';
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import {buildMultiIcon, useMultiIconProps} from '@/common/components/MultiIcon';
import {Translation, useTranslations} from '@/stores/persistent/translations';
import {useSession} from '@/stores/runtime/session';
import {MainStackPage, MainStackParams} from './types';
import DownloadsScreen from '@/screens/Downloads';
import UpdatesScreen from '@/screens/Updates';
import HomeScreen from '@/screens/Home';
import CurrAppScreen from '@/screens/CurrApp';
import ProvidersStack from './stacks/Providers';
import ToolsStack from './stacks/Tools';
import SettingsStack from './stacks/Settings';
import HelpStack from './stacks/Help';
import HomeLogo from './components/HomeLogo';
import DrawerContent from './components/DrawerContent';
import {useTheme} from '@/theme';
import HeaderLeft from './components/HeaderLeft';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export interface DrawerItemBase {
  title: Translation;
  icon: useMultiIconProps;
}

export interface BaseMainStackScreen {
  name: MainStackPage;
  component:
    | React.MemoExoticComponent<React.ComponentType>
    | React.ComponentType;
}

export type StaticMainStackScreen = DrawerItemBase & BaseMainStackScreen;

export interface DynamicMainStackScreen extends StaticMainStackScreen {
  headerTitle: () => React.ReactNode;
}

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const INITIAL_ROUTE: MainStackPage = 'home' as const;

const DYNAMIC_STACK_SCREENS: DynamicMainStackScreen[] = [
  {
    name: 'home',
    title: 'Home',
    icon: {name: 'home'},
    component: HomeScreen,
    headerTitle: () => <HomeLogo />,
  },
];

const HIDDEN_STACK_SCREENS: BaseMainStackScreen[] = [
  {
    name: 'currApp',
    component: CurrAppScreen,
  },
];

const STATIC_STACK_SCREENS: StaticMainStackScreen[] = [
  {
    name: 'downloads',
    title: 'Downloads',
    icon: {name: 'download'},
    component: DownloadsScreen,
  },
  {
    name: 'updates',
    title: 'Updates',
    icon: {name: 'update'},
    component: UpdatesScreen,
  },
  {
    name: 'providers-stack',
    title: 'Providers',
    icon: {name: 'puzzle'},
    component: ProvidersStack,
  },
  {
    name: 'tools-stack',
    title: 'Tools',
    icon: {name: 'tools'},
    component: ToolsStack,
  },
  {
    name: 'settings-stack',
    title: 'Settings',
    icon: {name: 'cog'},
    component: SettingsStack,
  },
  {
    name: 'help-stack',
    title: 'Help',
    icon: {name: 'help-circle'},
    component: HelpStack,
  },
] as const;

const hiddenScreenOptions: DrawerNavigationOptions[] = HIDDEN_STACK_SCREENS.map(
  () => ({
    drawerItemStyle: {display: 'none'},
  }),
);

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Drawer = createDrawerNavigator<MainStackParams>();

const MainStack = () => {
  const {colorScheme, schemedTheme} = useTheme();
  const translations = useTranslations(state => state.translations);
  const currPage = useSession(state => state.currPage);

  const drawerOptions: DrawerNavigationOptions = useMemo(() => {
    const backgroundColor =
      colorScheme === 'dark'
        ? schemedTheme.surfaceDim
        : schemedTheme.surfaceBright;

    return {
      drawerType: 'slide',
      headerTitleAlign: 'center',
      headerStyle: {
        height: 56,
        backgroundColor,
      },
      headerLeftContainerStyle: {
        overflow: 'hidden',
      },
      headerLeft: HeaderLeft,
      drawerStyle: {
        backgroundColor,
        width: 240,
        gap: 20,
      },
      unmountInactiveRoutes: true,
    };
  }, [colorScheme, schemedTheme]);

  const dynamicScreenOptions: DrawerNavigationOptions[] = useMemo(
    () =>
      DYNAMIC_STACK_SCREENS.map(screen => ({
        title: translations[screen.title],
        drawerIcon: buildMultiIcon(screen.icon.name, screen.icon.type),
        headerTitle: screen.headerTitle,
        drawerItemStyle: screen.name === currPage ? {display: 'none'} : {},
      })),
    [translations, currPage],
  );

  const staticScreenOptions: DrawerNavigationOptions[] = useMemo(
    () =>
      STATIC_STACK_SCREENS.map(screen => ({
        title: translations[screen.title],
        drawerIcon: buildMultiIcon(screen.icon.name, screen.icon.type),
      })),
    [translations],
  );

  return (
    <Drawer.Navigator
      initialRouteName={INITIAL_ROUTE}
      drawerContent={DrawerContent}
      screenOptions={drawerOptions}>
      {DYNAMIC_STACK_SCREENS.map((screen, i) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          navigationKey={screen.name}
          options={dynamicScreenOptions[i]}
          component={screen.component}
        />
      ))}
      {HIDDEN_STACK_SCREENS.map((screen, i) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          navigationKey={screen.name}
          options={hiddenScreenOptions[i]}
          component={screen.component}
        />
      ))}
      {STATIC_STACK_SCREENS.map((screen, i) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          navigationKey={screen.name}
          options={staticScreenOptions[i]}
          component={screen.component}
        />
      ))}
    </Drawer.Navigator>
  );
};

export default MainStack;
