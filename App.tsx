/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import Pages from "@/pages";
import FilesModule from "@/lib/files";
import { useTheme } from "@/theme";
import DrawerWrapper from "@/global/drawer";
import { useSettings } from "@/states/persistent/settings";
import { useDialogs } from "@/states/temporary/dialogs";
import { useApp } from "@/states/temporary/app";
import { useTips } from "@/states/temporary/tips";
import PermissionsModule from "@/lib/permissions";
import { initBackgroundTasks } from "@/lib/background";
import { useToken } from "@/states/persistent/token";

function App(): React.JSX.Element {
	const theme = useTheme();
	const deleteOnLeave = useSettings(
		(state) => state.settings.downloads.deleteOnLeave,
	);
	const openDialog = useDialogs().openDialog;
	const fetchTips = useTips().fetchTips;
	const initToken = useToken().init;
	const [info, localVersion] = useApp((state) => [
		state.info,
		state.localVersion,
	]);
	const [releaseNotification, updateNotification] = useSettings((state) => [
		state.settings.notifications.newReleaseNotification,
		state.settings.notifications.updatesNotification,
	]);

	useEffect(() => {
		if (localVersion && info.version && info.version > localVersion)
			openDialog("newVersion");
	}, [info, localVersion]);

	useEffect(() => {
		if (releaseNotification || updateNotification) {
			PermissionsModule.grantPostNotification().then((_) =>
				initBackgroundTasks(),
			);
		}
	}, [releaseNotification, updateNotification]);

	useEffect(() => {
		initToken();
		fetchTips();
		const deleteOnLeaveCallback = () => {
			if (deleteOnLeave) FilesModule.deleteAllFiles();
		};

		return deleteOnLeaveCallback;
	}, []);

	return (
		<>
			<StatusBar
				backgroundColor={theme.schemedTheme.surfaceContainer}
				barStyle={
					theme.colorScheme === "dark"
						? "light-content"
						: "dark-content"
				}
			/>
			<SafeAreaView>
				<View
					style={{
						width: "100%",
						height: "100%",
					}}
				>
					<DrawerWrapper>
						<Pages />
					</DrawerWrapper>
				</View>
			</SafeAreaView>
		</>
	);
}

export default App;
