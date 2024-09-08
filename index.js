import * as React from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import BackgroundTasksModule from '@/lib/backgroundTasks';
import ThemeProvider from '@/theme';
import {Toast} from '@/global/toast';
import {Dialogs} from '@/global/dialogs';
import App from './App';
import StatesBridgeManager from '@/states/bridge';

BackgroundFetch.registerHeadlessTask(BackgroundTasksModule.headlessTask);

function Root() {
  return (
    <ThemeProvider>
      <Toast />
      <Dialogs />
      <App />
      <StatesBridgeManager />
    </ThemeProvider>
  );
}

AppRegistry.registerComponent(appName, () => Root);
