import { Linking, StyleSheet, View } from "react-native";
import { Button, Dialog, ProgressBar, Text } from "react-native-paper";
import { useDialogsProps } from "@/states/temporary/dialogs";
import React, { useCallback, useMemo, useState } from "react";
import { useApp } from "@/states/temporary/app";
import FilesModule from "@/lib/files";
import ReactNativeBlobUtil from "react-native-blob-util";
import Carousel, { CarouselRenderItem } from "react-native-reanimated-carousel";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/theme";

const renderCarouselItem: CarouselRenderItem<{
	title: string;
	description: string;
}> = ({ item }) => (
	<View key={item.title} style={styles.carouselItem}>
		<Text variant="titleMedium" style={styles.carouselTitle}>
			{item.title}
		</Text>
		<Text variant="bodyMedium" style={styles.carouselDescription}>
			{item.description}
		</Text>
	</View>
);

export default function NewVersionDialog({
	activeDialog,
	closeDialog,
}: useDialogsProps) {
	const [progress, setProgress] = useState(0);
	const info = useApp((state) => state.info);
	const progressHeight = useSharedValue(0);
	const { schemedTheme } = useTheme();

	const update = useCallback(async () => {
		progressHeight.value = withTiming(10, { duration: 500 });
		const path = FilesModule.correctPath("updateme.apk");
		try {
			if (await ReactNativeBlobUtil.fs.exists(path)) {
				await ReactNativeBlobUtil.fs.unlink(path);
			}
		} catch {}
		ReactNativeBlobUtil.config({
			fileCache: true,
			path,
		})
			.fetch("GET", info.download, {})
			.progress((received, total) => {
				setProgress(parseFloat(received) / parseFloat(total));
			})
			.then((res) => {
				setProgress(1);
				FilesModule.installApk(res.path());
				progressHeight.value = withTiming(0, { duration: 500 });
				setTimeout(() => {
					setProgress(0);
				}, 500);
			});
	}, [info.download, progressHeight]);

	const handleManualDownload = useCallback(() => {
		Linking.openURL(info.download);
	}, [info.download]);

	const progressBarStyle = useAnimatedStyle(() => ({
		width: 300,
		marginBottom: -25,
		height: progressHeight.value,
		overflow: "hidden",
	}));

	const carouselData = useMemo(
		() => info.releaseNotes ?? [],
		[info.releaseNotes],
	);

	if (activeDialog !== "newVersion") return null;

	return (
		<Dialog visible={true} onDismiss={closeDialog} style={styles.dialog}>
			<Dialog.Title>{`Update Me v${info.version} is available!`}</Dialog.Title>
			<Dialog.Content style={styles.content}>
				<View style={styles.carouselContainer}>
					<Carousel
						width={300}
						height={100}
						loop
						autoPlay={true}
						autoPlayInterval={4000}
						data={carouselData}
						renderItem={renderCarouselItem}
					/>
					<Animated.View style={progressBarStyle}>
						<ProgressBar
							animatedValue={progress}
							color={schemedTheme.primary}
							style={styles.progressBar}
						/>
					</Animated.View>
				</View>
			</Dialog.Content>
			<Dialog.Actions style={styles.actions}>
				<Button onPress={handleManualDownload}>
					Download manually
				</Button>
				<Button onPress={update}>Update</Button>
			</Dialog.Actions>
		</Dialog>
	);
}

const styles = StyleSheet.create({
	dialog: {
		position: "relative",
	},
	content: {
		alignItems: "center",
		display: "flex",
		marginTop: 20,
		marginBottom: 20,
		gap: 20,
	},
	carouselContainer: {
		width: 300,
		height: 100,
		alignItems: "center",
		flexDirection: "column",
		justifyContent: "space-evenly",
		display: "flex",
	},
	carouselItem: {
		width: 300,
		height: 100,
		display: "flex",
		alignItems: "center",
		justifyContent: "space-evenly",
		alignContent: "center",
	},
	carouselTitle: {
		textAlign: "center",
	},
	carouselDescription: {
		textAlign: "center",
	},
	progressBar: {
		height: 10,
		borderRadius: 5,
	},
	actions: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
	},
});
