import * as React from "react";
import { List } from "react-native-paper";
import { Drawer } from "react-native-drawer-layout";
import { useTheme } from "@/theme";
import Animated from "react-native-reanimated";
import { useDrawer } from "@/states/runtime/drawer";
import { Dialog, useDialogs } from "@/states/runtime/dialogs";
import { useDownloads } from "@/states/runtime/downloads";
import { useTranslations } from "@/states/persistent/translations";
import { useNavigate } from "@/hooks/useNavigate";
import { usePulsing } from "@/hooks/usePulsing";
import { ListRenderItem, FlatList } from "react-native";
import { Page } from "@/types/navigation";

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

interface DrawerItem {
	key: string;
	title: string;
	description: string;
	icon: string;
	onClick: () => void;
}

interface DrawerWrapperProps {
	children: React.ReactNode;
}

const DrawerWrapper = ({ children }: DrawerWrapperProps) => {
	const { schemedTheme } = useTheme();
	const navigate = useNavigate();
	const [isDrawerOpen, closeDrawer] = useDrawer((state) => [
		state.isDrawerOpen,
		state.closeDrawer,
	]);
	const downloads = useDownloads((state) => state.downloads);
	const openDialog = useDialogs((state) => state.openDialog);
	const translations = useTranslations((state) => state.translations);
	const { startPulsing, cancelPulsing, pulsingStyles } = usePulsing();

	const pulseSettings = React.useMemo(
		() => isDrawerOpen && Object.keys(downloads).length > 0,
		[isDrawerOpen, downloads],
	);

	React.useEffect(() => {
		if (pulseSettings) {
			startPulsing();
		}
	}, [pulseSettings, startPulsing]);

	React.useEffect(() => {
		return () => {
			cancelPulsing();
		};
	}, [cancelPulsing]);

	const navigateTo = React.useCallback(
		(route: Page) => {
			closeDrawer();
			navigate(route);
		},
		[navigate],
	);

	const handleOpenDialog = React.useCallback(
		(key: Dialog) => {
			closeDrawer();
			openDialog(key);
		},
		[openDialog],
	);

	const items = React.useMemo(
		() => [
			{
				key: "downloads",
				title: translations["Downloads"],
				description: translations["View your downloads"],
				icon: "download",
				onClick: () => navigateTo("downloads"),
			},
			{
				key: "updates",
				title: translations["Updates"],
				description: translations["Check for updates"],
				icon: "update",
				onClick: () => navigateTo("updates"),
			},
			{
				key: "tips",
				title: translations["Tips"],
				description: translations["Maximize your experience"],
				icon: "star-four-points",
				onClick: () => navigateTo("tips"),
			},
			{
				key: "settings",
				title: translations["Settings"],
				description: translations["Change the app settings"],
				icon: "cog",
				onClick: () => navigateTo("settings"),
			},
			{
				key: "suggest",
				title: translations["Suggest"],
				description: translations["Suggest a new app"],
				icon: "lightbulb-on",
				onClick: () => navigateTo("suggest"),
			},
			{
				key: "share",
				title: translations["Share"],
				description: translations["Share the app with friends"],
				icon: "share-variant",
				onClick: () => handleOpenDialog("share"),
			},
			{
				key: "report",
				title: translations["Report"],
				description: translations["Report a problem with the app"],
				icon: "bug",
				onClick: () => navigateTo("report"),
			},
		],
		[navigateTo, handleOpenDialog, translations],
	);

	const renderDrawerItem: ListRenderItem<DrawerItem> = React.useCallback(
		({ item }) => (
			<AnimatedListItem
				title={item.title}
				description={item.description}
				left={(props) => <List.Icon {...props} icon={item.icon} />}
				onPress={item.onClick}
				style={item.key === "downloads" ? pulsingStyles : undefined}
			/>
		),
		[],
	);

	const renderDrawerContent = React.useCallback(() => {
		return (
			<List.Section>
				<FlatList
					data={items}
					renderItem={renderDrawerItem}
					keyExtractor={(item: DrawerItem) => item.key}
				/>
			</List.Section>
		);
	}, [items]);

	return (
		<Drawer
			open={isDrawerOpen}
			onOpen={() => {}}
			onClose={closeDrawer}
			drawerPosition="right"
			swipeEnabled={false}
			drawerStyle={{
				backgroundColor: schemedTheme.surfaceContainer,
			}}
			renderDrawerContent={renderDrawerContent}
		>
			{children}
		</Drawer>
	);
};

DrawerWrapper.displayName = "DrawerWrapper";

export default DrawerWrapper;
