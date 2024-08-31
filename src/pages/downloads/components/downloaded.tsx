import * as React from "react";
import { View } from "react-native";
import { Checkbox, IconButton, List } from "react-native-paper";
import Share from "react-native-share";
import { useTheme } from "@/theme";
import FilesModule from "@/lib/files";
import MultiIcon from "@/components/multiIcon";
import { ReactNativeBlobUtilStat } from "react-native-blob-util";
import { NavigationProps } from "@/hooks/navigation";

export default function Downloaded({
  files,
  updateFiles,
  navigation,
}: {
  files: Record<string, ReactNativeBlobUtilStat>;
  updateFiles: () => void;
  navigation: NavigationProps;
}) {
  const theme = useTheme();
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);

  const selectFile = React.useCallback((file: string) => {
    setSelectedFiles((prev) =>
      prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file]
    );
  }, []);

  const handleShare = React.useCallback(() => {
    Share.open({
      urls: selectedFiles.map((file) => "file://" + files[file].path),
    }).catch(() => {});
  }, [selectedFiles, files]);

  const handleSelectAll = React.useCallback(() => {
    setSelectedFiles((prev) =>
      prev.length === Object.keys(files).length ? [] : Object.keys(files)
    );
  }, [files]);

  const handleDelete = React.useCallback(() => {
    Promise.all(selectedFiles.map((file) => FilesModule.deleteFile(file)))
      .then(updateFiles)
      .then(() => setSelectedFiles([]));
  }, [selectedFiles, updateFiles]);

  const headerRight = React.useMemo(() => {
    if (selectedFiles.length === 0) {
      return () => <IconButton icon="refresh" onPress={updateFiles} />;
    }
    return () => (
      <View style={{ flexDirection: "row" }}>
        <IconButton icon="share" onPress={handleShare} />
        <IconButton
          icon={
            Object.keys(files).length === selectedFiles.length
              ? "checkbox-multiple-blank-outline"
              : "checkbox-multiple-marked"
          }
          onPress={handleSelectAll}
        />
        <IconButton icon="trash-can" onPress={handleDelete} />
      </View>
    );
  }, [
    selectedFiles,
    files,
    updateFiles,
    handleShare,
    handleSelectAll,
    handleDelete,
  ]);

  React.useEffect(() => {
    navigation.setOptions({ headerRight });
  }, [navigation, headerRight]);

  if (Object.keys(files).length === 0) {
    return null;
  }

  return (
    <List.Section title="Downloaded">
      {Object.entries(files).map(([file, fileStats]) => (
        <List.Item
          key={file}
          title={file}
          description={`${(fileStats.size / 1024 / 1024).toFixed(2)} MB`}
          onPress={() => {
            selectedFiles.length === 0
              ? FilesModule.installApk(file)
              : selectFile(file);
          }}
          onLongPress={() => selectFile(file)}
          style={{
            backgroundColor: selectedFiles.includes(file)
              ? theme.schemedTheme.surfaceBright
              : theme.schemedTheme.surface,
          }}
          left={(props) => (
            <MultiIcon
              {...props}
              size={25}
              type="font-awesome"
              name="android"
            />
          )}
          right={(props) =>
            selectedFiles.length > 0 && (
              <Checkbox
                {...props}
                status={selectedFiles.includes(file) ? "checked" : "unchecked"}
              />
            )
          }
        />
      ))}
    </List.Section>
  );
}
