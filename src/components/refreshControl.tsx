import * as React from "react";
import { RefreshControl } from "react-native";
import { UseThemeProps } from "@/theme";

interface ThemedRefreshControlProps {
	onRefresh: () => void;
	refreshing?: boolean;
}

export default function ThemedRefreshControl(
	theme: UseThemeProps,
	{ onRefresh, refreshing = false }: ThemedRefreshControlProps,
) {
	return (
		<RefreshControl
			refreshing={refreshing}
			colors={[theme.sourceColor]}
			progressBackgroundColor={theme.schemedTheme.surfaceBright}
			onRefresh={onRefresh}
		/>
	);
}
