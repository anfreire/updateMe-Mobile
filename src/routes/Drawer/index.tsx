import React, {ComponentType, useCallback, useMemo} from 'react';
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import HomeLogo from './components/HomeLogo';
import DrawerContent, {DrawerItemBase} from './components/DrawerContent';
import {buildMultiIcon} from '@/common/components/MultiIcon';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import AppsNavigator from '@/routes/Apps';
import DownloadsScreen from '@/screens/Downloads';
import UpdatesScreen from '@/screens/Updates';
import ProvidersScreen from '@/screens/Providers';
import SettingsNavigator from '../Settings';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTranslations} from '@/stores/persistent/translations';
import {useSession} from '@/stores/runtime/session';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type DrawerStackPage =
  | 'apps-stack'
  | 'downloads'
  | 'updates'
  | 'providers'
  | 'settings-stack';

export type DrawerStackParams = {
  'apps-stack': undefined;
  downloads: undefined;
  updates: undefined;
  providers: undefined;
  'settings-stack': undefined;
};

export type DrawerStackNavigationProps = NavigationProp<DrawerStackPage>;

export type DrawerStackRouteProps = RouteProp<DrawerStackParams>;

export interface DrawerScreen extends DrawerItemBase {
  name: DrawerStackPage;
  component:
    | React.ComponentType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | React.MemoExoticComponent<ComponentType<any>>;
}
export type DrawerStackPageProps<T extends DrawerStackPage> =
  NativeStackScreenProps<DrawerStackParams, T>;

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const DRAWER_SCREENS: DrawerScreen[] = [
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
    name: 'providers',
    title: 'Providers',
    icon: {name: 'server'},
    component: ProvidersScreen,
  },
  {
    name: 'settings-stack',
    title: 'Settings',
    icon: {name: 'cog'},
    component: SettingsNavigator,
  },
] as const;

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const HomeTitleLogo = () => <HomeLogo />;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Drawer = createDrawerNavigator<DrawerStackParams>();

const DrawerNavigator = () => {
  const translations = useTranslations(state => state.translations);
  const currPage = useSession(state => state.currPage);

  const appsDrawerItemStyle = useMemo(
    () => (currPage === 'apps' ? ({display: 'none'} as {display: 'none'}) : {}),
    [currPage],
  );

  const appsStackOptions = useMemo(
    () => ({
      headerTitle: HomeTitleLogo,
      drawerItemStyle: appsDrawerItemStyle,
      title: translations['Home'],
      drawerIcon: buildMultiIcon('home'),
    }),
    [appsDrawerItemStyle, translations],
  );

  const getScreenOptions = useCallback(
    (screen: DrawerScreen): DrawerNavigationOptions => ({
      title: translations[screen.title],
      drawerIcon: buildMultiIcon(screen.icon.name),
    }),
    [translations],
  );

  return (
    <Drawer.Navigator
      initialRouteName="apps-stack"
      drawerContent={DrawerContent}
      screenOptions={{
        drawerType: 'slide',
        headerTitleAlign: 'center',
      }}>
      <Drawer.Screen
        name="apps-stack"
        navigationKey="apps-stack"
        options={appsStackOptions}
        component={AppsNavigator}
      />
      {DRAWER_SCREENS.map(screen => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          navigationKey={screen.name}
          options={getScreenOptions(screen)}
          component={screen.component}
        />
      ))}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
