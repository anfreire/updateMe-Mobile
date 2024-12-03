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
import {useTheme as useReactNavigationTheme} from '@react-navigation/native';
import {Portal} from 'react-native-paper';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

type LayoutProps = React.PropsWithChildren;

const Layout = ({children}: LayoutProps) => {
  const {colorScheme} = useTheme();
  const {colors} = useReactNavigationTheme();

  const statusBarProps: {
    backgroundColor: string;
    barStyle: StatusBarStyle;
  } = useMemo(
    () => ({
      backgroundColor: colors.card,
      barStyle: colorScheme === 'dark' ? 'light-content' : 'dark-content',
    }),
    [colors.card, colorScheme],
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
