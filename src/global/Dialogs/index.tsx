import * as React from 'react';
import {Portal} from 'react-native-paper';
import SourceColorPickerDialog from './components/ColorPickerDialog';
import ColorSchemePickerDialog from './components/ColorSchemeDialog';
import ShareDialog from './components/ShareDialog';
import NewVersionDialog from './components/NewVersionDialog';
import CustomDialog from './components/CustomDialog';
import IgnoredAppsDialog from './components/IgnoredAppsDialog';
import ProvidersOrderDialog from './components/ProvidersOrderDialog';
import {ActiveDialogType, useDialogs} from '@/states/runtime/dialogs';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/
const ACTIVE_DIALOG_TO_COMPONENT: Record<
  Exclude<ActiveDialogType, null>,
  React.ComponentType
> = {
  custom: CustomDialog,
  sourceColorPicker: SourceColorPickerDialog,
  colorSchemePicker: ColorSchemePickerDialog,
  share: ShareDialog,
  ignoredApps: IgnoredAppsDialog,
  providersOrder: ProvidersOrderDialog,
  newVersion: NewVersionDialog,
} as const;

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useDialogsComponent() {
  const activeDialog = useDialogs(state => state.activeDialog);

  const DialogComponent = React.useMemo(() => {
    return activeDialog ? ACTIVE_DIALOG_TO_COMPONENT[activeDialog] : null;
  }, [activeDialog]);

  return {DialogComponent};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Dialogs = () => {
  const {DialogComponent} = useDialogsComponent();

  if (!DialogComponent) {
    return null;
  }

  return (
    <Portal>
      <DialogComponent />
    </Portal>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(Dialogs);
