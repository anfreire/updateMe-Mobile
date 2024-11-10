import * as React from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import BackgroundTasksModule from '@/lib/backgroundTasks';
import ThemeProvider from '@/theme';
import App from './App';
import Toast from '@/global/Toast';
import Dialogs from '@/global/Dialogs';
import StatesBridgeManager from '@/states/bridge';

BackgroundFetch.registerHeadlessTask(BackgroundTasksModule.headlessTask);

const Root = () => (
  <ThemeProvider>
    <Toast />
    <Dialogs />
    <App />
    <StatesBridgeManager />
  </ThemeProvider>
);

AppRegistry.registerComponent(appName, () => Root);
