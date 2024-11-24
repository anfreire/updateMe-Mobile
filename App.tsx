/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.gestureHandlerWrapper}>
      <SafeAreaView>
        <StatusBar />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/
const styles = StyleSheet.create({
  gestureHandlerWrapper: {
    flex: 1,
  },
});

export default App;
