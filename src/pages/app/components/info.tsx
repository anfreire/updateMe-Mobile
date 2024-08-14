import { Button, Card, DataTable, Text } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { View } from "react-native";
import { useSettings } from "@/states/persistent/settings";
import { useTheme } from "@/theme";
import { useDialogs } from "@/states/temporary/dialogs";
import { useDownloads } from "@/states/temporary/downloads";
import { useDrawer } from "@/states/temporary/drawer";
import { AppScreenChildProps } from "..";
import AppsModule from "@/lib/apps";
import { useSession } from "@/states/temporary/session";
import { useToast } from "@/states/temporary/toast";
import FilesModule from "@/lib/files";
import { useCallback } from "react";

export default function AppInfo(props: AppScreenChildProps) {
	const theme = useTheme();
	const installUnsafe = useSettings(
		(state) => state.settings.security.installUnsafeApps,
	);
	const openDialog = useDialogs().openDialog;
	const addDownload = useDownloads().addDownload;
	const [drawerWasOpenedInThisSession, activateSessionFlag, setCurrPage] = useSession(
		(state) => [state.flags.downloadsOpenedDrawer, state.activateFlag, state.setCurrPage],
	);
	const openDrawer = useDrawer((state) => state.openDrawer);
	const openToast = useToast().openToast;

  const navigate = useCallback(
    (route: string, params?: Record<string, any>) => {
      props.navigation.navigate(route, params);
    },
    [props.navigation]
  );

  const handleDownloadAndInstall = useCallback(() => {
    if (!installUnsafe && !props.currApp.providers[props.currApp.defaultProvider].safe) {
      openDialog({
				title: "Potentially unsafe apk",
				content:
					'The VirusTotal analysis of this apk reported potential risks. To install it, enable the "Risk Taker" setting in the settings page.',
				actions: [
					{
						title: "Cancel",
						action: () => {},
					},
					{
						title: "Go to settings",
						action: () =>
							props.navigation.navigate("Settings", {
								setting: "Risk Taker",
							}),
					},
				],
			});
    }

	const downlaodAndInstall = () => {
		if (
			!installUnsafe &&
			!props.currApp.providers[props.currApp.defaultProvider].safe
		) {
			openDialog({
				title: "Potentially unsafe apk",
				content:
					'The VirusTotal analysis of this apk reported potential risks. To install it, enable the "Risk Taker" setting in the settings page.',
				actions: [
					{
						title: "Cancel",
						action: () => {},
					},
					{
						title: "Go to settings",
						action: () =>
							props.navigation.navigate("Settings", {
								setting: "Risk Taker",
							}),
					},
				],
			});
		} else {
			const providerInfo =
				props.currApp.providers[props.currApp.defaultProvider];
			if (!drawerWasOpenedInThisSession) {
				openDrawer();
				activateSessionFlag("downloadsOpenedDrawer");
			} else {
				openToast(
					`${props.currApp.name} was added to the downloads`,
					undefined,
					{
						label: "Open",
						onPress: () => props.navigation.navigate("Downloads"),
					},
				);
			}
			addDownload(
				props.currApp.name + " " + providerInfo.version + ".apk",
				providerInfo.download,
				undefined,
				(path) =>
					openToast(
						`${props.currApp.name} finished downloading`,
						undefined,
						{
							label: "Install",
							onPress: () => FilesModule.installApk(path),
						},
					),
			);
		}
	};
	return (
		<Card
			contentStyle={{
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: 20,
				gap: 20,
			}}
		>
			<DataTable>
				<DataTable.Row
					style={{
						flexDirection: "row",
						width: "80%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<DataTable.Cell
						style={{
							justifyContent: "flex-end",
							marginRight: 10,
						}}
					>
						<Text style={{ fontWeight: "bold" }}>
							Local Version
						</Text>
					</DataTable.Cell>
					<DataTable.Cell
						style={{
							justifyContent: "flex-start",
						}}
					>
						<Text
							style={{
								color:
									props.currApp?.version == null
										? theme.schemedTheme.error
										: undefined,
							}}
						>
							{props.currApp.version ?? "Not installed"}
						</Text>
					</DataTable.Cell>
				</DataTable.Row>
				<DataTable.Row>
					<DataTable.Cell
						style={{
							justifyContent: "flex-end",
							marginRight: 10,
						}}
					>
						<Text style={{ fontWeight: "bold" }}>
							Available Version
						</Text>
					</DataTable.Cell>
					<DataTable.Cell
						style={{
							justifyContent: "flex-start",
						}}
					>
						<Text>
							{props.currApp.providers[
								props.currApp.defaultProvider
							]?.version ?? ""}
						</Text>
					</DataTable.Cell>
				</DataTable.Row>
			</DataTable>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					gap: 10,
				}}
			>
				{props.currApp.version == null ? (
					<>
						<Button
							onPress={downlaodAndInstall}
							icon={(props) => (
								<MaterialIcons
									{...props}
									name="install-mobile"
								/>
							)}
							mode="contained-tonal"
						>
							Install
						</Button>
					</>
				) : props.currApp.version <
				  props.currApp.providers[props.currApp.defaultProvider]
						.version ? (
					<>
						<Button
							onPress={() =>
								AppsModule.uninstallApp(
									props.currApp.providers[
										props.currApp.defaultProvider
									].packageName,
								)
							}
							icon={(props) => (
								<MaterialIcons
									{...props}
									name="delete-forever"
								/>
							)}
							mode="contained-tonal"
						>
							Uninstall
						</Button>
						<Button
							onPress={downlaodAndInstall}
							icon={(props) => (
								<MaterialIcons
									{...props}
									name="security-update"
								/>
							)}
							mode="contained-tonal"
						>
							Update
						</Button>
					</>
				) : (
					<>
						<Button
							onPress={() =>
								AppsModule.uninstallApp(
									props.currApp.providers[
										props.currApp.defaultProvider
									].packageName,
								)
							}
							icon={(props) => (
								<MaterialIcons
									{...props}
									name="delete-forever"
								/>
							)}
							mode="contained-tonal"
						>
							Uninstall
						</Button>
						<Button
							icon={(props) => (
								<MaterialIcons {...props} name="exit-to-app" />
							)}
							mode="contained-tonal"
							onPress={() =>
								AppsModule.openApp(
									props.currApp.providers[
										props.currApp.defaultProvider
									].packageName,
								)
							}
						>
							Open
						</Button>
					</>
				)}
			</View>
		</Card>
	);
}
