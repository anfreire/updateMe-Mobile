import React, { useCallback, useMemo } from "react";
import { Image, StyleSheet, Dimensions } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { Share } from "react-native";
import { useDialogsProps } from "@/states/temporary/dialogs";
import { useApp } from "@/states/temporary/app";

const QRCODE_RELEASES = require("@assets/QRCODE.png");

const { width } = Dimensions.get("window");
const QR_CODE_SIZE = width * 0.55;

export default function ShareDialog({
	activeDialog,
	closeDialog,
}: useDialogsProps) {
	const info = useApp((state) => state.info);

	const handleShare = useCallback(() => {
		Share.share(
			{ message: info.download, title: "UpdateMe Download Link" },
			{ dialogTitle: "UpdateMe Download Link" },
		);
	}, [info.download]);

	const isVisible = useMemo(() => activeDialog === "share", [activeDialog]);

	return (
		<Portal>
			<Dialog
				visible={isVisible}
				onDismiss={closeDialog}
				style={styles.dialog}
			>
				<Dialog.Title>Share</Dialog.Title>
				<Dialog.Content style={styles.content}>
					<Image
						source={QRCODE_RELEASES}
						resizeMode="contain"
						style={styles.qrCode}
					/>
					<Button mode="contained-tonal" onPress={handleShare}>
						Share the download link
					</Button>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={closeDialog}>Done</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
}

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
