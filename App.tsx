/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useEffect, useState} from 'react';
import Layout from '@/layout';
import LoadingScreen from '@/screens/Loading';
import MainStack from '@/navigation';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

function App(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeot = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timeot);
  }, []);

  return <Layout>{isLoading ? <LoadingScreen /> : <MainStack />}</Layout>;
}

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default App;
