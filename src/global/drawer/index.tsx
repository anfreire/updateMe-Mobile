import * as React from 'react';
import {Drawer} from 'react-native-drawer-layout';
import {useTheme} from '@/theme';
import {useDrawer} from '@/states/runtime/drawer';
import DrawerList from './components/DrawerList';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface DrawerWrapperProps {
  children: React.ReactNode;
}

const DrawerWrapper = ({children}: DrawerWrapperProps) => {
  const {schemedTheme} = useTheme();
  const [isDrawerOpen, closeDrawer] = useDrawer(state => [
    state.isDrawerOpen,
    state.closeDrawer,
  ]);

  return (
    <Drawer
      open={isDrawerOpen}
      onOpen={() => {}}
      onClose={closeDrawer}
      drawerPosition="right"
      swipeEnabled={false}
      drawerStyle={{
        backgroundColor: schemedTheme.surfaceContainer,
      }}
      renderDrawerContent={DrawerList}>
      {children}
    </Drawer>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(DrawerWrapper);
