import * as React from "react";
import { Page } from "@/types/navigation";
import { useFocusEffect } from "@react-navigation/native";
import { useSession } from "@/states/runtime/session";

export function useCurrPageEffect(currPage: Page) {
  const setCurrPage = useSession((state) => state.setCurrPage);

  useFocusEffect(React.useCallback(() => setCurrPage(currPage), [currPage]));

  return null;
}
