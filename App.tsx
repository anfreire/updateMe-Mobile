/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import DrawerNavigator from '@/navigation';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

function App(): React.JSX.Element {
  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.appWrapper}>
        <DrawerNavigator />
      </SafeAreaView>
    </>
  );
}

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default App;
