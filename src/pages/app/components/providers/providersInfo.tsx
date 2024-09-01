import * as React from "react";
import { useTranslations } from "@/states/persistent/translations";
import { useDialogs } from "@/states/runtime/dialogs";
import { IconButton } from "react-native-paper";
import { StyleSheet } from "react-native";
import { CurrAppProps } from "@/hooks/useCurrApp";

interface ProvidersInfoProps {
  providers: CurrAppProps["providers"];
}

const ProvidersInfo = ({ providers }: ProvidersInfoProps) => {
  const openDialog = useDialogs((state) => state.openDialog);
  const translations = useTranslations((state) => state.translations);

  const handlePress = React.useCallback(() => {
    openDialog({
      title: "Providers",
      content:
        translations[
          "Providers are different sources for the same app. Because they were made by different developers, they may have different versions, features or bugs."
        ],
      actions: [{ title: "Ok", action: () => {} }],
    });
  }, [translations]);

  if (Object.keys(providers).length < 2) return null;

  return (
    <IconButton icon="information" style={style.button} onPress={handlePress} />
  );
};

const style = StyleSheet.create({
  button: {
    position: "absolute",
    top: 5,
    right: 5,
  },
});

ProvidersInfo.displayName = "ProvidersInfo";

export default React.memo(ProvidersInfo);
