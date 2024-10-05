import * as React from 'react';
import SourceColorPickerDialog from './components/appearance';
import ColorSchemePickerDialog from './components/scheme';
import ShareDialog from './components/share';
import NewVersionDialog from './components/newVersion';
import {Portal} from 'react-native-paper';
import CustomDialog from './components/custom';

export function Dialogs() {
  return (
    <Portal>
      <CustomDialog />
      <SourceColorPickerDialog />
      <ColorSchemePickerDialog />
      <ShareDialog />
      <NewVersionDialog />
    </Portal>
  );
}
