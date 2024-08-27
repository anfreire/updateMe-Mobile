import * as React from "react";
import React, { memo, useCallback, useMemo } from "react";
import { CurrAppProps } from "@/states/computed/currApp";
import { useTranslations } from "@/states/persistent/translations";
import { useDialogs } from "@/states/temporary/dialogs";
import { IconButton } from "react-native-paper";
import { StyleSheet } from "react-native";

const ProvidersInfo = ({ currApp }: { currApp: CurrAppProps }) => {
  const openDialog = useDialogs((state) => state.openDialog);
  const translations = useTranslations();

  const handlePress = useCallback(() => {
    openDialog({
      title: "Providers",
      content:
        translations[
          "Providers are different sources for the same app. Because they were made by different developers, they may have different versions, features or bugs."
        ],
      actions: [{ title: "Ok", action: () => {} }],
    });
  }, [translations]);

  if (Object.keys(currApp.providers).length < 2) return null;

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

export default memo(ProvidersInfo);
