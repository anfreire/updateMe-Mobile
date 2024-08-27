import * as React from "react";
import { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, DataTable, Text } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useShallow } from "zustand/react/shallow";
import { useSettings } from "@/states/persistent/settings";
import { useTheme } from "@/theme";
import { useDialogs } from "@/states/temporary/dialogs";
import { useDownloads } from "@/states/temporary/downloads";
import { useDrawer } from "@/states/temporary/drawer";
import { useSession } from "@/states/temporary/session";
import { useToast } from "@/states/temporary/toast";
import { useNavigate } from "@/hooks/navigation";
import { useTranslations, interpolate } from "@/states/persistent/translations";
import { CurrAppProps, useCurrApp } from "@/states/computed/currApp";
import AppsModule from "@/lib/apps";
import FilesModule from "@/lib/files";

const DataRow = ({
  title,
  value,
  valueColor,
}: {
  title: string;
  value: string;
  valueColor?: string;
}) => (
  <DataTable.Row>
    <DataTable.Cell style={styles.titleCell}>
      <Text style={styles.titleText}>{title}</Text>
    </DataTable.Cell>
    <DataTable.Cell style={styles.versionCell}>
      <Text style={{ color: valueColor }}>{value}</Text>
    </DataTable.Cell>
  </DataTable.Row>
);

export default function AppInfo({ currApp }: { currApp: CurrAppProps }) {
  const theme = useTheme();
  const [installUnsafe, installAfterDownload] = useSettings(
    useShallow((state) => [
      state.settings.security.installUnsafeApps,
      state.settings.downloads.installAfterDownload,
    ])
  );
  const openDialog = useDialogs((state) => state.openDialog);
  const addDownload = useDownloads((state) => state.addDownload);
  const [drawerWasOpenedInThisSession, activateSessionFlag] = useSession(
    useShallow((state) => [
      state.flags.downloadsOpenedDrawer,
      state.activateFlag,
    ])
  );
  const openDrawer = useDrawer((state) => state.openDrawer);
  const openToast = useToast((state) => state.openToast);
  const translations = useTranslations();
  const navigate = useNavigate();

  const providerInfo = useMemo(
    () => currApp.providers[currApp.defaultProvider],
    [currApp.providers, currApp.defaultProvider]
  );

  const handleUnsafeInstall = useCallback(() => {
    if (installUnsafe || providerInfo.safe) return;

    openDialog({
      title: translations["Potentially unsafe apk"],
      content: interpolate(
        translations[
          'The VirusTotal analysis of this apk reported potential risks. To install it, enable the "$1" setting in the settings page.'
        ],
        translations["Risk Taker"]
      ),
      actions: [
        { title: translations["Cancel"], action: () => {} },
        {
          title: translations["Go to settings"],
          action: () =>
            navigate("settings", { setting: translations["Risk Taker"] }),
        },
      ],
    });
  }, [installUnsafe, providerInfo.safe, translations, navigate]);

  const handleSafeInstall = useCallback(() => {
    const fileName = FilesModule.buildFileName(
      currApp.name,
      providerInfo.version
    );

    addDownload(fileName, providerInfo.download, undefined, (path) => {
      if (installAfterDownload) {
        FilesModule.installApk(path);
      } else {
        openToast(
          interpolate(translations["$1 finished downloading"], currApp.name),
          undefined,
          {
            label: translations["Install"],
            onPress: () => FilesModule.installApk(path),
          }
        );
      }
    });

    if (!drawerWasOpenedInThisSession) {
      openDrawer();
      activateSessionFlag("downloadsOpenedDrawer");
    } else {
      openToast(
        interpolate(
          translations["$1 was added to the downloads"],
          currApp.name
        ),
        undefined,
        {
          label: "Open",
          onPress: () => navigate("downloads"),
        }
      );
    }
  }, [
    currApp,
    providerInfo,
    translations,
    drawerWasOpenedInThisSession,
    installAfterDownload,
    navigate,
  ]);

  const handleInstall = useCallback(() => {
    installUnsafe || providerInfo.safe
      ? handleSafeInstall()
      : handleUnsafeInstall();
  }, [
    installUnsafe,
    providerInfo.safe,
    handleSafeInstall,
    handleUnsafeInstall,
  ]);

  const localVersionProps = useMemo(
    () => ({
      color: currApp.version === null ? theme.schemedTheme.error : undefined,
      version:
        currApp.version == null
          ? translations["Not installed"]
          : currApp.version,
    }),
    [currApp.version, theme.schemedTheme.error, translations]
  );

  const buttonProps = useMemo(() => {
    if (currApp.version == null) {
      return {
        icon: "install-mobile",
        label: translations["Install"],
        action: handleInstall,
      };
    }
    if (currApp.version < providerInfo.version) {
      return {
        icon: "security-update",
        label: translations["Update"],
        action: handleInstall,
      };
    }
    return {
      icon: "exit-to-app",
      label: translations["Open"],
      action: () => AppsModule.openApp(providerInfo.packageName),
    };
  }, [currApp.version, providerInfo, translations, handleInstall]);

  return (
    <Card contentStyle={styles.card}>
      <DataTable>
        <DataRow
          title={translations["Local Version"]}
          value={localVersionProps.version}
          valueColor={localVersionProps.color}
        />
        <DataRow
          title={translations["Available Version"]}
          value={providerInfo.version}
        />
      </DataTable>
      <View style={styles.buttonWrapper}>
        <Button
          onPress={buttonProps.action}
          icon={(props) => <MaterialIcons {...props} name={buttonProps.icon} />}
          mode="contained-tonal"
        >
          {buttonProps.label}
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  titleCell: {
    justifyContent: "flex-end",
    marginRight: 10,
  },
  titleText: {
    fontWeight: "bold",
  },
  versionCell: {
    justifyContent: "flex-start",
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
});
