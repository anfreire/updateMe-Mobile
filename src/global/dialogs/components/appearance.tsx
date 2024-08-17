import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet } from "react-native";
import { Button, Dialog, IconButton } from "react-native-paper";
import { ColorPicker, fromHsv, toHsv } from "react-native-color-picker";
import { HsvColor } from "react-native-color-picker/dist/typeHelpers";
import { useTheme } from "@/theme";
import { useToast } from "@/states/temporary/toast";
import { ActiveDialogType, useDialogs } from "@/states/temporary/dialogs";
import { useTranslations } from "@/states/persistent/translations";
import { useShallow } from "zustand/react/shallow";

export default function SourceColorPickerDialog({
  activeDialog,
}: {
  activeDialog: ActiveDialogType;
}) {
  const { sourceColor, setSourceColor, resetSourceColor } = useTheme();

  const closeDialog = useDialogs((state) => state.closeDialog);
  const [openToast, closeToast] = useToast(
    useShallow((state) => [state.openToast, state.closeToast])
  );
  const translations = useTranslations();

  const [oldColor, setOldColor] = useState("");
  const [activeColor, setActiveColor] = useState<HsvColor>({
    h: 0,
    s: 0,
    v: 0,
  });

  const handleClose = useCallback(() => {
    closeDialog();
    setOldColor("");
    closeToast();
  }, []);

  const handleInfoPress = useCallback(() => {
    openToast(translations["Tap on the middle circle to test the color"]);
  }, [translations]);

  const handleCancel = useCallback(() => {
    setSourceColor(oldColor);
    handleClose();
  }, [oldColor, handleClose]);

  const handleUseSystem = useCallback(() => {
    resetSourceColor();
    handleClose();
  }, [handleClose]);

  const handleSave = useCallback(() => {
    setSourceColor(fromHsv(activeColor));
    handleClose();
  }, [activeColor, handleClose]);

  useEffect(() => {
    if (activeDialog === "sourceColorPicker") {
      setOldColor(sourceColor);
      setActiveColor(toHsv(sourceColor));
    }
  }, [activeDialog, sourceColor]);

  if (activeDialog !== "sourceColorPicker") return null;

  return (
    <Dialog visible onDismiss={handleClose} style={styles.dialog}>
      <IconButton
        icon="information"
        onPress={handleInfoPress}
        style={styles.infoButton}
      />
      <Dialog.Title>{translations["Source Color"]}</Dialog.Title>
      <Dialog.Content style={styles.content}>
        <ColorPicker
          color={activeColor}
          onColorSelected={setSourceColor}
          defaultColor={oldColor}
          style={styles.colorPicker}
          hideSliders
          onColorChange={setActiveColor}
        />
      </Dialog.Content>
      <Dialog.Actions style={styles.actions}>
        <Button onPress={handleCancel}>{translations["Cancel"]}</Button>
        <Button onPress={handleUseSystem}>{translations["Use System"]}</Button>
        <Button onPress={handleSave}>{translations["Save"]}</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialog: {
    position: "relative",
  },
  infoButton: {
    position: "absolute",
    top: -10,
    right: 0,
    zIndex: 1000,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  colorPicker: {
    width: 300,
    height: 300,
  },
  actions: {
    justifyContent: "space-around",
  },
});
