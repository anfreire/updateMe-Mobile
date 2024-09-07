import * as React from "react";
import { Image, View, StyleSheet } from "react-native";
import { Button, List, Text } from "react-native-paper";
import { interpolate, useTranslations } from "@/states/persistent/translations";
import { useDownloads, useDownloadsProps } from "@/states/runtime/downloads";
import { useToast } from "@/states/runtime/toast";
import { useTheme } from "@/theme";
import { useIndex } from "@/states/fetched";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/types/navigation";

const AppIcon = (uri?: string) => () => (
  <View style={styles.iconContainer}>
    <Image style={styles.icon} source={{ uri }} resizeMode="contain" />
  </View>
);

const RightItem =
  (
    updateTranslation: string,
    onPress: () => void,
    color: string,
    downloads: useDownloadsProps["downloads"],
    fileName: string | null = null
  ) =>
  () => (
    <View style={styles.rightContainer}>
      {fileName ? (
        <Text style={[styles.progressText, { color }]}>
          {`${(downloads[fileName].progress * 100).toFixed(0)}%`}
        </Text>
      ) : (
        <Button mode="contained-tonal" onPress={onPress}>
          {updateTranslation}
        </Button>
      )}
    </View>
  );

export default function UpdateItem({
  appName,
  fileName,
  updateApp,
}: {
  appName: string;
  fileName: string | null;
  updateApp: (appName: string) => void;
}) {
  const translations = useTranslations((state) => state.translations);
  const index = useIndex((state) => state.index);
  const downloads = useDownloads((state) => state.downloads);
  const theme = useTheme();
  const openToast = useToast((state) => state.openToast);
  const { navigate } = useNavigation<NavigationProps>();

  const handlePress = React.useCallback(() => {
    openToast(
      interpolate(translations["Long press to enter $1 page"], appName)
    );
  }, [translations, appName]);

  const handleLongPress = React.useCallback(() => {
    navigate("app", { app: appName });
  }, [appName, navigate]);

  return (
    <List.Item
      title={appName}
      titleStyle={styles.title}
      left={AppIcon(index[appName].icon)}
      right={RightItem(
        translations["Update"],
        () => updateApp(appName),
        theme.schemedTheme.secondary,
        downloads,
        fileName
      )}
      onPress={handlePress}
      onLongPress={handleLongPress}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  icon: {
    width: 30,
    height: 30,
  },
  rightContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 0,
    width: 100,
    minHeight: 40,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
