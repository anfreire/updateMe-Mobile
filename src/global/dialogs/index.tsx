import * as React from 'react';
import SourceColorPickerDialog from './components/appearance';
import ColorSchemePickerDialog from './components/scheme';
import HomeLayoutPickerDialog from './components/layout';
import ShareDialog from './components/share';
import NewVersionDialog from './components/newVersion';
import {Portal} from 'react-native-paper';
import CustomDialog from './components/custom';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '@/types/navigation';

export function Dialogs() {
  const {navigate} = useNavigation<NavigationProps>();
  return (
    <Portal>
      <CustomDialog />
      <SourceColorPickerDialog />
      <ColorSchemePickerDialog />
      <HomeLayoutPickerDialog navigate={navigate} />
      <ShareDialog />
      <NewVersionDialog />
    </Portal>
  );
}
