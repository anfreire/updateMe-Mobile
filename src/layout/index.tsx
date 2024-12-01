import React, {useMemo} from 'react';
import {SafeAreaView, StatusBar, StatusBarStyle} from 'react-native';
import Toast from './Toast';
import Dialogs from './Dialogs';
import {useTheme} from '@/theme';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

type LayoutProps = React.PropsWithChildren;

const Layout = ({children}: LayoutProps) => {
  const {cssVars, schemedTheme, colorScheme} = useTheme();

  const statusBarProps: {
    backgroundColor: string;
    barStyle: StatusBarStyle;
  } = useMemo(
    () => ({
      backgroundColor: schemedTheme.surfaceContainer,
      barStyle: colorScheme === 'dark' ? 'light-content' : 'dark-content',
    }),
    [schemedTheme, colorScheme],
  );

  return (
    <>
      <StatusBar {...statusBarProps} />
      <SafeAreaView className="flex-1" style={cssVars}>
        <Toast />
        <Dialogs />
        {children}
      </SafeAreaView>
    </>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default Layout;
