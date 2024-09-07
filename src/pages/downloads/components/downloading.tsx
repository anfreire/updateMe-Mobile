import * as React from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, List, Text, TouchableRipple } from "react-native-paper";
import { useDialogs } from "@/states/runtime/dialogs";
import { useTheme } from "@/theme";
import { ReactNativeBlobUtilStat } from "react-native-blob-util";
import { useDownloads } from "@/states/runtime/downloads";
import { useTranslations, interpolate } from "@/states/persistent/translations";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";

const CancelIcon = (props: { color: string; style: Style }) => (
  <TouchableRipple style={[styles.cancelButton, props.style]}>
    <IconButton icon="cancel" size={25} />
  </TouchableRipple>
);

const ProgressText = (progress: number, color: string) => () => (
  <View style={styles.progressContainer}>
    <Text style={[styles.progressText, { color }]}>
      {`${(progress * 100).toFixed(0)}%`}
    </Text>
  </View>
);

const DownloadItem = ({
  download,
  progress,
  onCancel,
}: {
  download: string;
  progress: number;
  onCancel: (download: string) => void;
}) => {
  const theme = useTheme();

  return (
    <List.Item
      onPress={() => onCancel(download)}
      title={download}
      left={CancelIcon}
      right={ProgressText(progress, theme.schemedTheme.secondary)}
    />
  );
};

export default function Downloading({
  files,
}: {
  files: Record<string, ReactNativeBlobUtilStat>;
}) {
  const openDialog = useDialogs((state) => state.openDialog);
  const [downloads, cancelDownload] = useDownloads((state) => [
    state.downloads,
    state.cancelDownload,
  ]);
  const translations = useTranslations((state) => state.translations);

  const handleCancelDownload = React.useCallback(
    (download: string) => {
      openDialog({
        title: translations["Cancel download"],
        content: interpolate(
          translations["Are you sure you want to cancel the download of $1?"],
          download
        ),
        actions: [
          {
            title: translations["Keep downloading"],
            action: () => {},
          },
          {
            title: translations["Cancel"],
            action: () => cancelDownload(download),
          },
        ],
      });
    },
    [translations]
  );

  const downloadItems = React.useMemo(() => {
    return Object.keys(files).map((download) => (
      <DownloadItem
        key={download}
        download={download}
        progress={downloads[download].progress}
        onCancel={handleCancelDownload}
      />
    ));
  }, [files, downloads, handleCancelDownload]);

  if (Object.keys(files).length === 0) {
    return null;
  }

  return <List.Section title="Downloading">{downloadItems}</List.Section>;
}

const styles = StyleSheet.create({
  progressContainer: {
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
  cancelButton: {
    position: "relative",
    width: 20,
    height: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
