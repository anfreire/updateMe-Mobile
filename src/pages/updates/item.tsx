import * as React from "react";
import { Image, View, StyleSheet } from "react-native";
import { Button, List, Text } from "react-native-paper";
import { useVersions } from "@/states/computed/versions";
import { useDefaultProviders } from "@/states/persistent/defaultProviders";
import { interpolate, useTranslations } from "@/states/persistent/translations";
import { useDownloads } from "@/states/runtime/downloads";
import { useToast } from "@/states/runtime/toast";
import { useTheme } from "@/theme";
import { useIndex } from "@/states/fetched";
import { useNavigate } from "@/hooks/useNavigate";

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
  const navigate = useNavigate();
  const defaultProviders = useDefaultProviders(
    (state) => state.defaultProviders
  );
  const versions = useVersions((state) => state.versions);

  const handlePress = React.useCallback(() => {
    openToast(
      interpolate(translations["Long press to enter $1 page"], appName)
    );
  }, [openToast, translations, appName]);

  const handleLongPress = React.useCallback(() => {
    navigate("app", { params: { app: appName } });
  }, [appName, index, defaultProviders, versions, navigate]);

  return (
    <List.Item
      title={appName}
      titleStyle={styles.title}
      left={() => (
        <View style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={{ uri: index[appName].icon }}
            resizeMode="contain"
          />
        </View>
      )}
      right={() => (
        <View style={styles.rightContainer}>
          {fileName ? (
            <Text
              style={[
                styles.progressText,
                { color: theme.schemedTheme.secondary },
              ]}
            >
              {`${(downloads[fileName].progress * 100).toFixed(0)}%`}
            </Text>
          ) : (
            <Button mode="contained-tonal" onPress={() => updateApp(appName)}>
              {translations["Update"]}
            </Button>
          )}
        </View>
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
