import { useSession, Page } from "@/states/temporary/session";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

interface PageParams {
	app: undefined;
	downloads: undefined;
	home: undefined;
	loading: undefined;
	report: undefined;
	settings: undefined;
	suggest: undefined;
	tip: undefined;
	tips: undefined;
	updates: undefined;
}

const PREVIOUS_ROUTES: Record<Page, Page | null> = {
	app: "home",
	downloads: "home",
	home: null,
	loading: null,
	report: "home",
	settings: "home",
	suggest: "home",
	tip: "tips",
	tips: "home",
	updates: "home",
} as const;

export function useNavigate() {
	const navigation = useNavigation<NavigationProp<PageParams>>();
	const setCurrPage = useSession(useShallow((state) => state.setCurrPage));

	return useCallback(
		<T extends Page>(page: T, params?: PageParams[T]) => {
			navigation.navigate(page as Page, params);
			setCurrPage(page);
		},
		[navigation.navigate, setCurrPage],
	);
}

export function useSilentNavigate() {
	const navigation = useNavigation<NavigationProp<PageParams>>();

	return useCallback(
		<T extends Page>(page: T, params?: PageParams[T]) => {
			navigation.navigate(page as Page, params);
		},
		[navigation.navigate],
	);
}

export function useGoBack() {
	const navigation = useNavigation<NavigationProp<PageParams>>();
	const [currPage, setCurrPage] = useSession(
		useShallow((state) => [state.currPage, state.setCurrPage]),
	);

	return useCallback(() => {
		const prevPage = PREVIOUS_ROUTES[currPage];
		if (!prevPage) return;
		navigation.goBack();
		setCurrPage(prevPage);
	}, [navigation.navigate, setCurrPage, currPage]);
}
