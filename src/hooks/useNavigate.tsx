import * as React from "react";
import { useSession } from "@/states/runtime/session";
import { useNavigation } from "@react-navigation/native";
import { Page, PagesParams, NavigationProps } from "@/types/navigation";

type NavigateOptions<T extends Page> = {
  params?: PagesParams[T];
  silent?: boolean;
};

export function useNavigate() {
  const { navigate } = useNavigation<NavigationProps>();
  const setCurrPage = useSession((state) => state.setCurrPage);

  return React.useCallback(
    <T extends Page>(page: Page, options: NavigateOptions<T> = {}) => {
      const { params, silent = false } = options;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigate(page as any, params);

      if (!silent) {
        setCurrPage(page);
      }
    },
    [navigate]
  );
}
