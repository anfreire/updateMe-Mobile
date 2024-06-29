import {useDialogs} from '@/states/temporary/dialogs';
import DefaultDialog from './components/default';
import SourceColorPickerDialog from './components/appearance';
import ColorSchemePickerDialog from './components/scheme';
import HomeLayoutPickerDialog from './components/layout';
import ShareDialog from './components/share';
import NewVersionDialog from './components/newVersion';

export function DialogsWrapper({children}: {children: React.ReactNode}) {
  const {activeDialog, defaultDialogProps, openDialog, closeDialog} =
    useDialogs(state => ({
      activeDialog: state.activeDialog,
      defaultDialogProps: state.defaultDialogProps,
      openDialog: state.openDialog,
      closeDialog: state.closeDialog,
    }));

  return (
    <>
      {children}
      <DefaultDialog
        activeDialog={activeDialog}
        defaultDialogProps={defaultDialogProps}
        openDialog={openDialog}
        closeDialog={closeDialog}
      />
      <SourceColorPickerDialog
        activeDialog={activeDialog}
        defaultDialogProps={defaultDialogProps}
        openDialog={openDialog}
        closeDialog={closeDialog}
      />
      <ColorSchemePickerDialog
        activeDialog={activeDialog}
        defaultDialogProps={defaultDialogProps}
        openDialog={openDialog}
        closeDialog={closeDialog}
      />
      <HomeLayoutPickerDialog
        activeDialog={activeDialog}
        defaultDialogProps={defaultDialogProps}
        openDialog={openDialog}
        closeDialog={closeDialog}
      />
      <ShareDialog
        activeDialog={activeDialog}
        defaultDialogProps={defaultDialogProps}
        openDialog={openDialog}
        closeDialog={closeDialog}
      />

      <NewVersionDialog
        activeDialog={activeDialog}
        defaultDialogProps={defaultDialogProps}
        openDialog={openDialog}
        closeDialog={closeDialog}
      />
    </>
  );
}
