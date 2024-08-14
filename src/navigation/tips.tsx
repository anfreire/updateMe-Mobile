import { useTips } from "@/states/temporary/tips";
import { useTheme } from "@/theme";
import { createStackNavigator } from "@react-navigation/stack";
import { IconButton } from "react-native-paper";
import TipsScreen from "@/pages/tips";
import TipScreen from "@/pages/tips/tip";
import { useCallback, useMemo } from "react";
import { Page, useSession } from "@/states/temporary/session";

const Stack = createStackNavigator();

function TipsStack({ navigation }: { navigation: any }) {
	const theme = useTheme();
	const currTip = useTips((state) => state.currTip);
	const setCurrPage = useSession((state) => state.setCurrPage);

	const headerLeft = useCallback(
		(page: Page) => (
			<IconButton
				icon="arrow-left"
				onPress={() => {
					setCurrPage(page);
					navigation.goBack();
				}}
			/>
		),
		[navigation],
	);

	const themeOptions = useMemo(
		() => ({
			headerStyle: {
				backgroundColor: theme.schemedTheme.surfaceContainer,
			},
			headerTitleStyle: {
				color: theme.schemedTheme.onSurface,
			},
		}),
		[theme.schemedTheme],
	);

	return (
		<Stack.Navigator initialRouteName="tips" id="tips-stack">
			<Stack.Screen
				name="tips"
				options={{
					headerTitle: "Tips",
					headerLeft: (_) => headerLeft("home"),
					...themeOptions,
				}}
				component={TipsScreen}
			/>
			<Stack.Screen
				name="tip"
				options={{
					headerTitle: currTip ?? "",
					headerLeft: (_) => headerLeft("tips"),
					...themeOptions,
				}}
				component={TipScreen}
			/>
		</Stack.Navigator>
	);
}
