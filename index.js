/**
 * @format
 */
import * as React from 'react';
import 'react-native-gesture-handler';
import {AppRegistry, StyleSheet} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ThemeProvider from '@/theme';
import './global.css';

const Root = () => (
  <ThemeProvider>
    <GestureHandlerRootView style={styles.gestureHandlerWrapper}>
      <App />
    </GestureHandlerRootView>
  </ThemeProvider>
);

AppRegistry.registerComponent(appName, () => Root);

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  gestureHandlerWrapper: {
    flex: 1,
  },
});
