import * as React from "react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Dialog, SegmentedButtons } from "react-native-paper";
import { ActiveDialogType, useDialogs } from "@/states/temporary/dialogs";
import { SavedColorSchemeType, useTheme } from "@/theme";
import MultiIcon from "@/components/multiIcon";
import { useSettings } from "@/states/persistent/settings";
import { IconProps } from "react-native-paper/lib/typescript/components/MaterialCommunityIcon";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { StyleSheet } from "react-native";
import { useTranslations } from "@/states/persistent/translations";

export default function ColorSchemePickerDialog({
  activeDialog,
}: {
  activeDialog: ActiveDialogType;
}) {
  const colorScheme = useSettings((state) => state.settings.theme.colorScheme);
  const [savedColorScheme, setSavedColorScheme] = useState(colorScheme);
  const { setColorScheme } = useTheme();
  const translations = useTranslations();
  const closeDialog = useDialogs((state) => state.closeDialog);

  const colorSchemeOptions = useMemo(
    () => [
      {
        label: translations["System"],
        value: "system",
        icon: ((props: IconProps) => (
          <MultiIcon {...props} type="material-icons" name="memory" />
        )) as IconSource,
      },
      {
        label: translations["Light"],
        value: "light",
        icon: ((props: IconProps) => (
          <MultiIcon {...props} type="material-icons" name="light-mode" />
        )) as IconSource,
      },
      {
        label: translations["Dark"],
        value: "dark",
        icon: ((props: IconProps) => (
          <MultiIcon {...props} type="material-icons" name="dark-mode" />
        )) as IconSource,
      },
    ],
    [translations]
  );

  useEffect(() => {
    if (activeDialog === "colorSchemePicker") {
      setSavedColorScheme(colorScheme);
    }
  }, [activeDialog, colorScheme]);

  const handleColorSchemeChange = useCallback((value: SavedColorSchemeType) => {
    setColorScheme(value);
  }, []);

  const handleRevert = useCallback(() => {
    setColorScheme(savedColorScheme);
    closeDialog();
  }, [savedColorScheme]);

  if (activeDialog !== "colorSchemePicker") return null;

  return (
    <Dialog visible onDismiss={handleRevert}>
      <Dialog.Title>{translations["Color Scheme"]}</Dialog.Title>
      <Dialog.Content>
        <SegmentedButtons
          style={styles.segmentedButtons}
          value={colorScheme}
          onValueChange={handleColorSchemeChange as (value: string) => void}
          buttons={colorSchemeOptions}
        />
      </Dialog.Content>
      <Dialog.Actions style={styles.dialogActions}>
        <Button onPress={handleRevert}>{translations["Revert"]}</Button>
        <Button onPress={closeDialog}>{translations["Save"]}</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  segmentedButtons: {
    marginVertical: 15,
  },
  dialogActions: {
    justifyContent: "space-between",
  },
});
