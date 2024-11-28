/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {
  getAppVersion,
  getInstalledApps,
  installApk,
  openApp,
  uninstallApp,
} from '@/lib/appManager';
import {pickFile} from '@/lib/files';
import {checkPermission} from '@/lib/permissions';
import React, {useCallback, useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

function App(): React.JSX.Element {
  const install = useCallback(() => {
    pickFile().then(file => {
      if (file) {
        installApk(file).then(res => console.log(`Install result: ${res}`));
      }
    });
  }, []);

  const uninstall = useCallback(() => {
    uninstallApp('com.wuliang.xapkinstaller').then(res =>
      console.log(`Uninstall result: ${res}`),
    );
  }, []);
  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.appWrapper}>
        <View style={styles.appWrapper}>
          <Button onPress={install}>Install</Button>
          <Button onPress={uninstall}>Uninstall</Button>
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
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default App;
