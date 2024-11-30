import React, {useCallback} from 'react';
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import HomeLogo from './components/HomeLogo';
import DrawerContent, {DrawerItemBase} from './components/DrawerContent';
import {buildMultiIcon} from '@/common/components/MultiIcon';
import {useTranslation} from 'react-i18next';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import AppsNavigator from '@/navigation/Apps';
import DownloadsScreen from '@/screens/downloads';
import UpdatesScreen from '@/screens/updates';
import ProvidersScreen from '@/screens/providers';
import SettingsNavigator from '../Settings';

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
  component: React.ComponentType;
}

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
];

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const HomeTitleLogo = () => <HomeLogo />;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Drawer = createDrawerNavigator<DrawerStackParams>();

const DrawerNavigator = () => {
  const {t} = useTranslation();

  const getScreenOptions = useCallback(
    (screen: DrawerScreen): DrawerNavigationOptions => ({
      title: t(screen.title),
      drawerIcon: buildMultiIcon(screen.icon.name),
    }),
    [t],
  );

  return (
    <Drawer.Navigator
      initialRouteName="apps-stack"
      drawerContent={DrawerContent}
      screenOptions={{
        drawerType: 'slide',
      }}>
      <Drawer.Screen
        name="apps-stack"
        navigationKey="apps-stack"
        options={{
          headerTitle: HomeTitleLogo,
          headerTitleAlign: 'center',
          drawerItemStyle: {display: 'none'},
        }}
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
