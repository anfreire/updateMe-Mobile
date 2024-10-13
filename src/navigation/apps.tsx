import * as React from 'react';
import AppScreen from '@/pages/app';
import HomeScreen from '@/pages/home';
import {useTheme} from '@/theme';
import {createStackNavigator} from '@react-navigation/stack';
import {AppsStackParams} from '@/types/navigation';
import HomeLogo from '@/pages/home/components/HomeLogo';
import {useDrawerButton} from './buttons/useDrawerButton';
import {useBackButton} from './buttons/useBackButton';

const Stack = createStackNavigator<AppsStackParams>();

const HomeStack = () => {
  const {schemedTheme} = useTheme();

  const drawerButton = useDrawerButton();
  const backButton = useBackButton();

  return (
    <Stack.Navigator initialRouteName="home" id="apps-stack">
      <Stack.Screen
        name="home"
        options={{
          headerStyle: {
            backgroundColor: schemedTheme.surfaceContainer,
          },
          headerTitle: HomeLogo,
          headerRight: drawerButton,
        }}
        navigationKey="apps"
        component={HomeScreen}
      />
      <Stack.Screen
        name="app"
        options={{
          headerStyle: {
            backgroundColor: schemedTheme.surfaceContainer,
          },
          headerTitleStyle: {
            color: schemedTheme.onSurface,
          },
          headerTitle: '',
          headerLeft: backButton,
        }}
        navigationKey="app"
        component={AppScreen}
      />
    </Stack.Navigator>
  );
};

HomeStack.displayName = 'HomeStack';

export default HomeStack;
