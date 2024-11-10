import * as React from 'react';
import {Portal} from 'react-native-paper';
import SourceColorPickerDialog from './components/ColorPickerDialog';
import ColorSchemePickerDialog from './components/ColorSchemeDialog';
import ShareDialog from './components/ShareDialog';
import NewVersionDialog from './components/NewVersionDialog';
import CustomDialog from './components/CustomDialog';
import IgnoredAppsDialog from './components/IgnoredAppsDialog';
import ProvidersOrderDialog from './components/ProvidersOrderDialog';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Dialogs = () => (
  <Portal>
    <CustomDialog />
    <SourceColorPickerDialog />
    <ColorSchemePickerDialog />
    <ShareDialog />
    <IgnoredAppsDialog />
    <ProvidersOrderDialog />
    <NewVersionDialog />
  </Portal>
);

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(Dialogs);
