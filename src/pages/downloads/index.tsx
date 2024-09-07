import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { ReactNativeBlobUtilStat } from "react-native-blob-util";
import { useFocusEffect } from "@react-navigation/native";
import FilesModule from "@/lib/files";
import ThemedRefreshControl from "@/components/refreshControl";
import Downloading from "./components/downloading";
import Downloaded from "./components/downloaded";
import { useDownloads } from "@/states/runtime/downloads";
import { useTranslations } from "@/states/persistent/translations";
import { Page } from "@/types/navigation";
import { useCurrPageEffect } from "@/hooks/useCurrPageEffect";

const CURR_PAGE: Page = "downloads";

const REFRESH_INTERVAL = 2500;

const DownloadsScreen = () => {
  const downloads = useDownloads((state) => state.downloads);
  const [files, setFiles] = React.useState<
    Record<string, ReactNativeBlobUtilStat>
  >({});
  const translations = useTranslations((state) => state.translations);

  const updateFiles = React.useCallback(() => {
    FilesModule.getAllFilesInfo().then((newFiles) => {
      setFiles((prevFiles) =>
        JSON.stringify(prevFiles) === JSON.stringify(newFiles)
          ? prevFiles
          : newFiles
      );
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const interval = setInterval(updateFiles, REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }, [updateFiles])
  );

  const downloadingFiles = Object.entries(files).reduce(
    (acc, [key, value]) => {
      if (downloads[key]) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, ReactNativeBlobUtilStat>
  );

  const downloadedFiles = Object.entries(files).reduce(
    (acc, [key, value]) => {
      if (!downloads[key]) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, ReactNativeBlobUtilStat>
  );

  useCurrPageEffect(CURR_PAGE);

  if (Object.keys(files).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon source="delete-empty" size={50} />
        <Text variant="bodyLarge">{translations["No files downloaded"]}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      refreshControl={ThemedRefreshControl({
        onRefresh: updateFiles,
        refreshing: false,
      })}
    >
      <Downloading files={downloadingFiles} />
      <Downloaded files={downloadedFiles} updateFiles={updateFiles} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

DownloadsScreen.displayName = "DownloadsScreen";

export default DownloadsScreen;
