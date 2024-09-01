import * as React from "react";
import { useSession } from "@/states/runtime/session";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps, PREVIOUS_ROUTES } from "@/types/navigation";

export function useGoBack() {
  const navigation = useNavigation<NavigationProps>();
  const [currPage, setCurrPage] = useSession((state) => [
    state.currPage,
    state.setCurrPage,
  ]);

  return React.useCallback(() => {
    const prevPage = PREVIOUS_ROUTES[currPage];
    if (!prevPage) return;
    navigation.goBack();
    setCurrPage(prevPage);
  }, [navigation.navigate, currPage]);
}
