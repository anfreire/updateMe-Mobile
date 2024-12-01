/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import LoadingNavigator from '@/routes/Loading';
import Layout from '@/layout';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

function App(): React.JSX.Element {
  return (
    <Layout>
      <LoadingNavigator />
    </Layout>
  );
}

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default App;
