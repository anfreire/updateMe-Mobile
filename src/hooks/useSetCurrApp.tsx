import * as React from "react";
import { MainStackParams } from "@/navigation";
import { AppsStackParams } from "@/navigation/apps";
import { TipsStackParams } from "@/navigation/tips";
import { useSession, Page } from "@/states/temporary/session";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { IndexProps } from "@/states/temporary";

export type PageParams = AppsStackParams & MainStackParams & TipsStackParams;

export type NavigationProps = NavigationProp<PageParams>;

export function useSetCurrApp() {
	const navigation = useNavigation<NavigationProps>();
	const setCurrPage = useSession((state) => state.setCurrPage);

	return React.useCallback(
		(app: string) => {
			navigation.navigate("app", { app });
			setCurrPage("app");
		},
		[navigation.navigate],
	);
}
