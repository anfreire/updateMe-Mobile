/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

function App(): React.JSX.Element {
  return (
    <>
      <StatusBar />
      <SafeAreaView>
        <View style={styles.appWrapper}>
          <View style={{}}></View>
          <Text>Teste</Text>
        </View>
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
    backgroundColor: 'red',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default App;
