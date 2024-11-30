/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import LoadingNavigator from '@/navigation/Loading';
import {useTheme} from '@/theme';
import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

function App(): React.JSX.Element {
  const {cssVars} = useTheme();
  return (
    <>
      <StatusBar />
      <SafeAreaView className="flex-1" style={cssVars}>
        <LoadingNavigator />
      </SafeAreaView>
    </>
  );
}

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default App;
