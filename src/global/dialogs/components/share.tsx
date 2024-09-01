import * as React from "react";
import { Image, StyleSheet, Dimensions } from "react-native";
import { Button, Dialog } from "react-native-paper";
import { Share } from "react-native";
import { useDialogs } from "@/states/runtime/dialogs";
import { useTranslations } from "@/states/persistent/translations";
import { useApp } from "@/states/fetched/app";

const QRCODE_RELEASES = require("@assets/QRCODE.png");

const { width } = Dimensions.get("window");
const QR_CODE_SIZE = width * 0.55;

const ShareDialog = () => {
  const latestApp = useApp((state) => state.latest);
  const translations = useTranslations((state) => state.translations);
  const [activeDialog, closeDialog] = useDialogs((state) => [
    state.activeDialog,
    state.closeDialog,
  ]);

  const handleShare = React.useCallback(() => {
    Share.share(
      {
        message: latestApp.download,
        title: translations["UpdateMe Download Link"],
      },
      { dialogTitle: translations["UpdateMe Download Link"] }
    );
  }, [latestApp.download, translations]);

  if (activeDialog !== "share") return null;

  return (
    <Dialog visible onDismiss={closeDialog} style={styles.dialog}>
      <Dialog.Title>{translations["Share"]}</Dialog.Title>
      <Dialog.Content style={styles.content}>
        <Image
          source={QRCODE_RELEASES}
          resizeMode="contain"
          style={styles.qrCode}
        />
        <Button mode="contained-tonal" onPress={handleShare}>
          {translations["Share the download link"]}
        </Button>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={closeDialog}>{translations["Done"]}</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialog: {
    position: "relative",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    marginVertical: 20,
    gap: 20,
  },
  qrCode: {
    height: QR_CODE_SIZE,
    width: QR_CODE_SIZE,
  },
});

export default ShareDialog;

ShareDialog.displayName = "ShareDialog";
