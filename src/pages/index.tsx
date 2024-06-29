import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './home';
import {IconButton} from 'react-native-paper';
import LoadingScreen from './loading';
import HomeLogo from './home/components/logo';
import DownloadsScreen from './downloads';
import SettingsScreen from './settings';
import ReportScreen from './report';
import UpdatesScreen from './updates';
import AppScreen from './app';
import {useNavigation} from '@react-navigation/native';
import TipsScreen from './tips';
import SuggestScreen from './suggest';
import React from 'react';
import TipScreen from './tips/tip';
import {useTheme} from '@/theme';
import {useDrawer} from '@/states/temporary/drawer';
import {useCurrApp} from '@/states/computed/currApp';
import {useTips} from '@/states/temporary/tips';

const Stack = createStackNavigator();

function buildDrawerButton(openDrawer: () => void) {
  return () => <IconButton icon="menu" onPress={openDrawer} />;
}

function TipsStack({navigation}: {navigation: any}) {
  const theme = useTheme();
  const {currTip, setCurrTip} = useTips(state => ({
    currTip: state.currTip,
    setCurrTip: state.setCurrTip,
  }));
  return (
    <Stack.Navigator initialRouteName="Tips" id="tips-tab-navigator">
      <Stack.Screen
        name="Tips-Tips"
        options={{
          headerStyle: {
            backgroundColor: theme.schemedTheme.surfaceContainer,
          },
          headerTitleStyle: {
            color: theme.schemedTheme.onSurface,
          },
          headerTitle: 'Tips',
          headerLeft: _ => (
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          ),
        }}
        component={TipsScreen}
      />
      <Stack.Screen
        name="Tips-Tip"
        options={{
          headerTitle: currTip ?? '',
          headerStyle: {
            backgroundColor: theme.schemedTheme.surfaceContainer,
          },
          headerTitleStyle: {
            color: theme.schemedTheme.onSurface,
          },
          headerLeft: _ => (
            <IconButton
              icon="arrow-left"
              onPress={() => {
                navigation.navigate('Tips-Tips');
                setCurrTip(null);
              }}
            />
          ),
        }}
        component={TipScreen}
      />
    </Stack.Navigator>
  );
}

function HomeStack({navigation}: {navigation: any}) {
  const theme = useTheme();
  const openDrawer = useDrawer().openDrawer;
  const {currApp, setCurrApp} = useCurrApp(state => ({
    currApp: state.currApp,
    setCurrApp: state.setCurrApp,
  }));
  return (
    <Stack.Navigator initialRouteName="Home" id="home-tab-navigator">
      <Stack.Screen
        name="Home-Home"
        options={{
          headerStyle: {
            backgroundColor: theme.schemedTheme.surfaceContainer,
          },
          headerTitle: _ => <HomeLogo />,
          headerRight: buildDrawerButton(openDrawer),
        }}
        component={HomeScreen}
      />
      <Stack.Screen
        name="App-Home"
        options={{
          headerStyle: {
            backgroundColor: theme.schemedTheme.surfaceContainer,
          },
          headerTitleStyle: {
            color: theme.schemedTheme.onSurface,
          },
          headerTitle: currApp?.name ?? '',
          headerLeft: _ => (
            <IconButton
              icon="arrow-left"
              onPress={() => {
                setCurrApp(null);
                navigation.goBack();
              }}
            />
          ),
          headerRight: buildDrawerButton(openDrawer),
        }}
        component={AppScreen}
      />
    </Stack.Navigator>
  );
}

export default function Pages() {
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <>
      <Stack.Navigator id="main-tab-navigator" initialRouteName="Loading">
        <Stack.Screen
          name="Loading"
          options={{
            headerShown: false,
          }}
          component={LoadingScreen}
        />
        <Stack.Screen
          name="Home"
          options={{
            headerShown: false,
          }}
          component={HomeStack}
        />
        <Stack.Screen
          name="Downloads"
          options={{
            headerStyle: {
              backgroundColor: theme.schemedTheme.surfaceContainer,
            },
            headerTitleStyle: {
              color: theme.schemedTheme.onSurface,
            },
            headerTitle: 'Downloads',
            headerLeft: _ => (
              <IconButton
                icon="arrow-left"
                onPress={() => navigation.goBack()}
              />
            ),
          }}
          component={DownloadsScreen}
        />
        <Stack.Screen
          name="Report"
          options={{
            headerStyle: {
              backgroundColor: theme.schemedTheme.surfaceContainer,
            },
            headerTitleStyle: {
              color: theme.schemedTheme.onSurface,
            },
            headerTitle: 'Report',
            headerLeft: _ => (
              <IconButton
                icon="arrow-left"
                onPress={() => navigation.goBack()}
              />
            ),
          }}
          component={ReportScreen}
        />
        <Stack.Screen
          name="Settings"
          options={{
            headerStyle: {
              backgroundColor: theme.schemedTheme.surfaceContainer,
            },
            headerTitleStyle: {
              color: theme.schemedTheme.onSurface,
            },
            headerTitle: 'Settings',
            headerLeft: _ => (
              <IconButton
                icon="arrow-left"
                onPress={() => navigation.goBack()}
              />
            ),
          }}
          component={SettingsScreen}
        />
        <Stack.Screen
          name="Updates"
          options={{
            headerStyle: {
              backgroundColor: theme.schemedTheme.surfaceContainer,
            },
            headerTitleStyle: {
              color: theme.schemedTheme.onSurface,
            },
            headerTitle: 'Updates',
            headerLeft: _ => (
              <IconButton
                icon="arrow-left"
                onPress={() => navigation.goBack()}
              />
            ),
          }}
          component={UpdatesScreen}
        />
        <Stack.Screen
          name="Tips"
          options={{
            headerShown: false,
          }}
          component={TipsStack}
        />
        <Stack.Screen
          name="Suggest"
          options={{
            headerStyle: {
              backgroundColor: theme.schemedTheme.surfaceContainer,
            },
            headerTitleStyle: {
              color: theme.schemedTheme.onSurface,
            },
            headerTitle: 'Suggest an App',
            headerLeft: _ => (
              <IconButton
                icon="arrow-left"
                onPress={() => navigation.goBack()}
              />
            ),
          }}
          component={SuggestScreen}
        />
      </Stack.Navigator>
    </>
  );
}
