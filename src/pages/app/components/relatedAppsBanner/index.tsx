import * as React from "react";
import { Banner } from "react-native-paper";
import { useSession } from "@/states/runtime/session";
import { CurrAppProps } from "@/hooks/useCurrApp";
import { useRelatedAppsBanner } from "./useRelatedAppsBanner";
import { useTranslations } from "@/states/persistent/translations";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/types/navigation";

export default function RelatedAppsBanner({
  currApp,
}: {
  currApp: CurrAppProps;
}) {
  const addTracker = useSession((state) => state.addTracker);
  const translations = useTranslations((state) => state.translations);
  const { navigate, setParams } = useNavigation<NavigationProps>();

  const { message, data } = useRelatedAppsBanner(currApp);

  const handleUpdate = React.useCallback(() => {
    if (data.missingDependencies.length > 0) {
      setParams({ app: data.missingDependencies[0] });
    } else {
      navigate("updates");
    }
  }, [data, navigate, setParams]);

  const updateLabel = React.useMemo(
    () =>
      data.missingDependencies.length
        ? translations["View dependency"]
        : translations["View updates"],
    [data, translations]
  );

  const handleDismiss = React.useCallback(() => {
    addTracker("appsBannerDismissed", currApp.title);
  }, [currApp.title]);

  return (
    <Banner
      visible={message !== null}
      actions={[
        {
          label: translations["Dismiss"],
          onPress: handleDismiss,
        },
        {
          label: updateLabel,
          onPress: handleUpdate,
        },
      ]}
    >
      {message}
    </Banner>
  );
}
