import { MainStackParams } from "@/navigation";
import { HomeStackParams } from "@/navigation/apps";
import { TipsStackParams } from "@/navigation/tips";
import { useCurrApp } from "@/states/computed/currApp";
import { useSession, Page } from "@/states/temporary/session";
import { useTips } from "@/states/temporary/tips";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

type PageParams = HomeStackParams & MainStackParams & TipsStackParams;

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
  const setCurrPage = useSession((state) => state.setCurrPage);

  return useCallback(
    <T extends Page>(page: T, params?: PageParams[T]) => {
      navigation.navigate(page as Page, params);
      setCurrPage(page);
    },
    [navigation.navigate]
  );
}

export function useSilentNavigate() {
  const navigation = useNavigation<NavigationProp<PageParams>>();

  return useCallback(
    <T extends Page>(page: T, params?: PageParams[T]) => {
      navigation.navigate(page as Page, params);
    },
    [navigation.navigate]
  );
}

export function useGoBack() {
  const navigation = useNavigation<NavigationProp<PageParams>>();
  const [currPage, setCurrPage] = useSession((state) => [
    state.currPage,
    state.setCurrPage,
  ]);
  const setCurrTip = useTips((state) => state.setCurrTip);
  const clearCurrApp = useCurrApp((state) => state.clearCurrApp);

  return useCallback(() => {
    const prevPage = PREVIOUS_ROUTES[currPage];
    if (!prevPage) return;
    if (prevPage === "tips") setCurrTip(null);
    if (prevPage === "app") clearCurrApp();
    navigation.goBack();
    setCurrPage(prevPage);
  }, [navigation.navigate, currPage]);
}
