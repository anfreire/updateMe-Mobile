import { MainStackParams } from "@/navigation";
import { AppsStackParams } from "@/navigation/apps";
import { TipsStackParams } from "@/navigation/tips";
import { useSession, Page } from "@/states/temporary/session";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

export type PageParams = AppsStackParams & MainStackParams & TipsStackParams;

export type NavigationProps = NavigationProp<PageParams>;

export function useNavigate() {
	const navigation = useNavigation<NavigationProps>();
	const setCurrPage = useSession((state) => state.setCurrPage);

	return useCallback(
		<T extends Page>(
			page: T,
			params?: PageParams[T],
			silent: boolean = false,
		) => {
			navigation.navigate(page as Page, params);
			if (silent) return;
			setCurrPage(page);
		},
		[navigation.navigate],
	);
}
