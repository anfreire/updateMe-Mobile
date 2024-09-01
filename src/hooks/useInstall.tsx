import * as React from "react";
import { useSettings } from "@/states/persistent/settings";
import { useShallow } from "zustand/react/shallow";
import { useDialogs } from "@/states/runtime/dialogs";
import { interpolate, useTranslations } from "@/states/persistent/translations";
import { useNavigate } from "./useNavigate";
import FilesModule from "@/lib/files";
import { IndexAppProviderProps } from "@/states/fetched";
import { useDownloads } from "@/states/runtime/downloads";
import { useToast } from "@/states/runtime/toast";
import { useSession } from "@/states/runtime/session";
import { useDrawer } from "@/states/runtime/drawer";

export function useInstall(
  appName: string,
  providerProps: IndexAppProviderProps
) {
  const openDialog = useDialogs((state) => state.openDialog);
  const translations = useTranslations((state) => state.translations);
  const navigate = useNavigate();
  const addDownload = useDownloads((state) => state.addDownload);
  const openToast = useToast((state) => state.openToast);
  const openDrawer = useDrawer((state) => state.openDrawer);
  const [downloadsOpenedDrawer, activateFlag] = useSession((state) => [
    state.flags.downloadsOpenedDrawer,
    state.activateFlag,
  ]);
  const [installUnsafe, installAfterDownload] = useSettings(
    useShallow((state) => [
      state.settings.security.installUnsafeApps,
      state.settings.downloads.installAfterDownload,
    ])
  );

  const handleUnsafeInstall = React.useCallback(() => {
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
            navigate("settings", { params: { setting: "Risk Taker" } }),
        },
      ],
    });
  }, [translations, navigate]);

  const handleSafeInstall = React.useCallback(() => {
    const fileName = FilesModule.buildFileName(appName, providerProps.version);

    addDownload(fileName, providerProps.download, undefined, (path) => {
      if (installAfterDownload) {
        FilesModule.installApk(path);
      } else {
        openToast(
          interpolate(translations["$1 finished downloading"], appName),
          {
            action: {
              label: translations["Install"],
              onPress: () => FilesModule.installApk(path),
            },
          }
        );
      }
    });

    if (!downloadsOpenedDrawer) {
      openDrawer();
      activateFlag("downloadsOpenedDrawer");
    } else {
      openToast(
        interpolate(translations["$1 was added to the downloads"], appName),
        {
          action: {
            label: "Open",
            onPress: () => navigate("downloads"),
          },
        }
      );
    }
  }, [
    appName,
    providerProps.version,
    providerProps.download,
    installAfterDownload,
    translations,
    downloadsOpenedDrawer,
    navigate,
  ]);

  return React.useCallback(() => {
    installUnsafe || providerProps.safe
      ? handleSafeInstall()
      : handleUnsafeInstall();
  }, [
    installUnsafe,
    providerProps.safe,
    handleSafeInstall,
    handleUnsafeInstall,
  ]);
}
