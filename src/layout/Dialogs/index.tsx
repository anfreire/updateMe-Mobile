import React, {memo, useMemo} from 'react';
import {ActiveDialogType, useDialogs} from '@/stores/runtime/dialogs';
import ShareDialog from './Share';
import CustomDialog from './Custom';
import ColorSchemeDialog from './ColorScheme';
import SourceColorDialog from './SourceColor';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const ACTIVE_DIALOG_TO_COMPONENT: Record<
  Exclude<ActiveDialogType, null>,
  React.ComponentType
> = {
  custom: CustomDialog,
  share: ShareDialog,
  colorScheme: ColorSchemeDialog,
  sourceColor: SourceColorDialog,
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

  return <DialogComponent />;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(Dialogs);
