import {useDrawer} from '@/states/runtime/drawer';
import * as React from 'react';
import {IconButton} from 'react-native-paper';

export function useDrawerButton() {
  const openDrawer = useDrawer(state => state.openDrawer);

  return React.useCallback(
    () => <IconButton icon="menu" onPress={openDrawer} />,
    [],
  );
}
