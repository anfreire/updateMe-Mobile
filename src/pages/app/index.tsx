import { StyleSheet, View } from "react-native";
import React, { useCallback, useMemo } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import RelatedAppsBanner from "@/pages/app/components/relatedAppsBanner";
import { useTheme } from "@/theme";
import ThemedRefreshControl from "@/components/refreshControl";
import AppLogo from "@/pages/app/components/logo";
import AppInfo from "@/pages/app/components/info";
import AppFeatures from "@/pages/app/components/features";
import AppProvider from "@/pages/app/components/providers";
import { IndexProps, useIndex } from "@/states/temporary";
import {
	CurrAppProps,
	useCurrApp,
	useCurrAppProps,
} from "@/states/computed/currApp";
import { useVersions } from "@/states/computed/versions";
import { useFocusEffect } from "@react-navigation/native";
import { useDefaultProviders } from "@/states/persistent/defaultProviders";

export interface AppScreenChildProps {
	navigation: any;
	route: any;
	index: IndexProps;
	versions: Record<string, string | null>;
	updates: string[];
	currApp: CurrAppProps;
	setCurrApp: useCurrAppProps["setCurrApp"];
}

export default function AppScreen({ navigation, route }: any) {
	const [currApp, setCurrApp] = useCurrApp((state) => [
		state.currApp,
		state.setCurrApp,
	]);
	const theme = useTheme();

	if (!currApp) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={theme.sourceColor} />
			</View>
		);
	}

	const index = useIndex((state) => state.index);
	const defaultProviders = useDefaultProviders(
		(state) => state.defaultProviders,
	);
	const [versions, updates, refreshVersions] = useVersions((state) => [
		state.versions,
		state.updates,
		state.refresh,
	]);

	const refresh = useCallback(() => {
		refreshVersions({ index, defaultProviders });
	}, [refreshVersions, index, defaultProviders]);

	useFocusEffect(
		useCallback(() => {
			const interval: NodeJS.Timeout = setInterval(refresh, 2500);

			return () => {
				clearInterval(interval);
			};
		}, [refreshVersions]),
	);

	const childProps = useMemo(
		() => ({
			navigation,
			route,
			index,
			versions,
			updates,
			currApp,
			setCurrApp,
		}),
		[navigation, route, index, versions, updates, currApp, setCurrApp],
	);

	return (
		<>
			<RelatedAppsBanner
				navigation={navigation}
				route={route}
				index={index}
				versions={versions}
				updates={updates}
				currApp={currApp}
				setCurrApp={setCurrApp}
			/>
			<ScrollView
				refreshControl={ThemedRefreshControl(theme, {
					refreshing: false,
					onRefresh: refresh,
				})}
			>
				<View style={styles.contentContainer}>
					<AppLogo {...childProps} />
					<AppInfo {...childProps} />
					<AppFeatures currApp={currApp} />
					<AppProvider {...childProps} />
				</View>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},
	contentContainer: {
		width: "100%",
		height: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
		gap: 20,
	},
});
