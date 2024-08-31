import * as React from "react";
import { useDialogs } from "@/states/temporary/dialogs";
import DefaultDialog from "./components/default";
import SourceColorPickerDialog from "./components/appearance";
import ColorSchemePickerDialog from "./components/scheme";
import HomeLayoutPickerDialog from "./components/layout";
import ShareDialog from "./components/share";
import NewVersionDialog from "./components/newVersion";
import { Portal } from "react-native-paper";

const DialogComponents = {
  default: DefaultDialog,
  sourceColorPicker: SourceColorPickerDialog,
  colorSchemePicker: ColorSchemePickerDialog,
  homeLayoutPicker: HomeLayoutPickerDialog,
  share: ShareDialog,
  newVersion: NewVersionDialog,
};

export function Dialogs() {
  const activeDialog = useDialogs((state) => state.activeDialog);

  const ActiveDialog = React.useMemo(() => {
    return activeDialog ? DialogComponents[activeDialog] : null;
  }, [activeDialog]);

  if (!ActiveDialog) {
    return null;
  }

  return (
    <Portal>
      <ActiveDialog />
    </Portal>
  );
}
