import React, {memo, useMemo} from 'react';
import {ActiveDialogType, useDialogs} from '@/stores/runtime/dialogs';
import {Portal} from 'react-native-paper';
import ShareDialog from './ShareDialog';
import CustomDialog from './CustomDialog';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const ACTIVE_DIALOG_TO_COMPONENT: Record<
  Exclude<ActiveDialogType, null>,
  React.ComponentType
> = {
  custom: CustomDialog,
  share: ShareDialog,
} as const;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Dialogs = () => {
  const activeDialog = useDialogs(state => state.activeDialog);

  const DialogComponent = useMemo(() => {
    return activeDialog ? ACTIVE_DIALOG_TO_COMPONENT[activeDialog] : null;
  }, [activeDialog]);

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

export default memo(Dialogs);
