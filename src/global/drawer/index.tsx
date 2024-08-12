import { List } from "react-native-paper";
import { Drawer } from "react-native-drawer-layout";
import { useTheme } from "@/theme";
import { useNavigation } from "@react-navigation/native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import { useDrawer } from "@/states/temporary/drawer";
import { CustomDialogsType, useDialogs } from "@/states/temporary/dialogs";
import { useDownloads } from "@/states/temporary/downloads";
import { useCallback, useEffect, useMemo } from "react";

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

interface DrawerItem {
	title: string;
	description: string;
	icon: string;
	onClick: () => void;
}

export default function DrawerWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = useTheme();
	const navigation = useNavigation();
	const [isDrawerOpen, closeDrawer] = useDrawer((state) => [
		state.isDrawerOpen,
		state.closeDrawer,
	]);
	const downloads = useDownloads((state) => state.downloads);
	const openDialog = useDialogs((state) => state.openDialog);

	const opacity = useSharedValue(1);

	const animationStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	const pulse = useCallback(() => {
		opacity.value = withRepeat(
			withTiming(0.5, {
				duration: 600,
				easing: Easing.inOut(Easing.quad),
			}),
			-1,
			true,
		);
	}, [opacity]);

	const stopPulsing = useCallback(() => {
		opacity.value = withTiming(1, { duration: 300 });
	}, [opacity]);

	const navigateTo = useCallback(
		(route: string) => {
			closeDrawer();
			navigation.navigate(route as never);
		},
		[closeDrawer, navigation],
	);

	const handleOpenDialog = useCallback(
		(key: CustomDialogsType) => {
			closeDrawer();
			openDialog(key);
		},
		[closeDrawer, openDialog],
	);

	useEffect(() => {
		if (isDrawerOpen && Object.keys(downloads).length > 0) {
			pulse();
			const timer = setTimeout(stopPulsing, 2500);
			return () => clearTimeout(timer);
		} else {
			stopPulsing();
		}
	}, [isDrawerOpen, downloads, pulse, stopPulsing]);

	const items: Record<string, DrawerItem> = useMemo(
		() => ({
			downloads: {
				title: "Downloads",
				description: "View your downloads",
				icon: "download",
				onClick: () => navigateTo("Downloads"),
			},
			updates: {
				title: "Updates",
				description: "Check for updates",
				icon: "update",
				onClick: () => navigateTo("Updates"),
			},
			tips: {
				title: "Tips",
				description: "Maximize your experience",
				icon: "star-four-points",
				onClick: () => navigateTo("Tips"),
			},
			settings: {
				title: "Settings",
				description: "Change the app settings",
				icon: "cog",
				onClick: () => navigateTo("Settings"),
			},
			suggest: {
				title: "Suggest",
				description: "Suggest a new app",
				icon: "lightbulb-on",
				onClick: () => navigateTo("Suggest"),
			},
			share: {
				title: "Share",
				description: "Share the app with friends",
				icon: "share-variant",
				onClick: () => handleOpenDialog("share"),
			},
			report: {
				title: "Report",
				description: "Report a problem with the app",
				icon: "bug",
				onClick: () => navigateTo("Report"),
			},
		}),
		[navigateTo, handleOpenDialog],
	);

	const renderDrawerContent = useCallback(
		() => (
			<List.Section>
				{Object.entries(items).map(([key, item]) =>
					key === "downloads" ? (
						<AnimatedListItem
							key={key}
							title={item.title}
							description={item.description}
							style={animationStyle}
							left={(props) => (
								<List.Icon {...props} icon={item.icon} />
							)}
							onPress={item.onClick}
						/>
					) : (
						<List.Item
							key={key}
							title={item.title}
							description={item.description}
							left={(props) => (
								<List.Icon {...props} icon={item.icon} />
							)}
							onPress={item.onClick}
						/>
					),
				)}
			</List.Section>
		),
		[items, animationStyle],
	);

	return (
		<Drawer
			open={isDrawerOpen}
			onOpen={() => {}}
			onClose={closeDrawer}
			drawerPosition="right"
			swipeEnabled={false}
			drawerStyle={{
				backgroundColor: theme.schemedTheme.surfaceContainer,
			}}
			renderDrawerContent={renderDrawerContent}
		>
			{children}
		</Drawer>
	);
}
