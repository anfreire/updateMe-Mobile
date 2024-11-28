/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {checkPermission} from '@/lib/permissions';
import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

function App(): React.JSX.Element {
  useEffect(() => {
    checkPermission('android.permission.REQUEST_INSTALL_PACKAGES').then(res =>
      console.log(res),
    );
  }, []);
  return (
    <>
      <StatusBar />
      <SafeAreaView>
        <View style={styles.appWrapper}></View>
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
