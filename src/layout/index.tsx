import React, {useMemo} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StatusBarStyle,
  StyleSheet,
} from 'react-native';
import Toast from './Toast';
import Dialogs from './Dialogs';
import {useTheme} from '@/theme';
import {Portal} from 'react-native-paper';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

type LayoutProps = React.PropsWithChildren;

const Layout = ({children}: LayoutProps) => {
  const {colorScheme, schemedTheme} = useTheme();

  const statusBarProps: {
    backgroundColor: string;
    barStyle: StatusBarStyle;
  } = useMemo(
    () => ({
      backgroundColor:
        colorScheme === 'dark'
          ? schemedTheme.surfaceDim
          : schemedTheme.surfaceBright,
      barStyle: colorScheme === 'dark' ? 'light-content' : 'dark-content',
    }),
    [colorScheme, schemedTheme.surfaceDim, schemedTheme.surfaceBright],
  );

  return (
    <>
      <StatusBar {...statusBarProps} />
      <SafeAreaView style={styles.safeAreaView}>
        <Portal>
          <Toast />
          <Dialogs />
        </Portal>
        {children}
      </SafeAreaView>
    </>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default Layout;
