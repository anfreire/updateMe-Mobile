import * as React from 'react';
import AppScreen from '@/pages/app';
import HomeScreen from '@/pages/home';
import HomeLogo from '@/pages/home/components/logo';
import {useDrawer} from '@/states/runtime/drawer';
import {useTheme} from '@/theme';
import {createStackNavigator} from '@react-navigation/stack';
import {IconButton} from 'react-native-paper';
import {AppsStackParams, NavigationProps} from '@/types/navigation';
import {useNavigation} from '@react-navigation/native';

const Stack = createStackNavigator<AppsStackParams>();

const HomeStack = () => {
  const {schemedTheme} = useTheme();
  const openDrawer = useDrawer(state => state.openDrawer);
  const {goBack} = useNavigation<NavigationProps>();

  const headerRight = React.useCallback(
    () => <IconButton icon="menu" onPress={openDrawer} />,
    [],
  );

  const headerLeft = React.useCallback(
    () => <IconButton icon="arrow-left" onPress={goBack} />,
    [goBack],
  );

  return (
    <Stack.Navigator initialRouteName="home" id="apps-stack">
      <Stack.Screen
        name="home"
        options={{
          headerStyle: {
            backgroundColor: schemedTheme.surfaceContainer,
          },
          headerTitle: HomeLogo,
          headerRight,
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
          headerLeft,
          headerRight,
        }}
        navigationKey="app"
        component={AppScreen}
      />
    </Stack.Navigator>
  );
};

HomeStack.displayName = 'HomeStack';

export default HomeStack;
