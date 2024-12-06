import React, {useMemo} from 'react';
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import {buildMultiIcon, useMultiIconProps} from '@/common/components/MultiIcon';
import {Translation, useTranslations} from '@/stores/persistent/translations';
import {useSession} from '@/stores/runtime/session';
import {MainStackPage, MainStackParams} from './types';
import HomeStack from './stacks/Home';
import DownloadsScreen from '@/screens/Downloads';
import UpdatesScreen from '@/screens/Updates';
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

export interface MainStackScreen extends DrawerItemBase {
  name: MainStackPage;
  component:
    | React.ComponentType
    | React.MemoExoticComponent<React.ComponentType>;
  headerTitle?: () => React.ReactNode;
}

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const INITIAL_ROUTE: MainStackPage = 'home-stack' as const;

const MAIN_STACK_SCREENS: MainStackScreen[] = [
  {
    name: 'home-stack',
    title: 'Home',
    icon: {name: 'home'},
    component: HomeStack,
    headerTitle: () => <HomeLogo />,
  },
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
    };
  }, [colorScheme, schemedTheme]);

  const screenOptions: DrawerNavigationOptions[] = useMemo(
    () =>
      MAIN_STACK_SCREENS.map(screen => ({
        title: translations[screen.title],
        drawerIcon: buildMultiIcon(screen.icon.name, screen.icon.type),
        headerTitle: screen.headerTitle,
        drawerItemStyle:
          screen.name === 'home-stack' && currPage === 'home'
            ? {display: 'none'}
            : {},
      })),
    [translations, currPage],
  );

  return (
    <Drawer.Navigator
      initialRouteName={INITIAL_ROUTE}
      drawerContent={DrawerContent}
      screenOptions={drawerOptions}>
      {MAIN_STACK_SCREENS.map((screem, i) => (
        <Drawer.Screen
          key={i}
          name={screem.name}
          navigationKey={screem.name}
          options={screenOptions[i]}
          component={screem.component}
        />
      ))}
    </Drawer.Navigator>
  );
};

export default MainStack;
