import * as React from "react";
import React, { useCallback, useEffect, useMemo } from "react";
import { View, FlatList, ListRenderItemInfo } from "react-native";
import { Button, Icon, List, Text } from "react-native-paper";
import { useTheme } from "@/theme";
import { useIndex } from "@/states/temporary";
import { useToast } from "@/states/temporary/toast";
import { useDownloads } from "@/states/temporary/downloads";
import { useDefaultProviders } from "@/states/persistent/defaultProviders";
import { useVersions } from "@/states/computed/versions";
import ThemedRefreshControl from "@/components/refreshControl";
import FilesModule from "@/lib/files";
import { useFocusEffect } from "@react-navigation/native";
import { NavigationProps } from "@/hooks/navigation";
import { interpolate, useTranslations } from "@/states/persistent/translations";
import { useSettings } from "@/states/persistent/settings";
import UpdateItem from "./item";

export default function UpdatesScreen({
  navigation,
}: {
  navigation: NavigationProps;
}) {
  const theme = useTheme();
  const index = useIndex((state) => state.index);
  const defaultProviders = useDefaultProviders(
    (state) => state.defaultProviders
  );
  const [updates, refresh] = useVersions((state) => [
    state.updates,
    state.refresh,
  ]);
  const openToast = useToast((state) => state.openToast);
  const addDownload = useDownloads((state) => state.addDownload);
  const translations = useTranslations();
  const installAfterDownload = useSettings(
    (state) => state.settings.downloads.installAfterDownload
  );
  const [updating, setUpdating] = React.useState<Record<string, string>>({});

  const updateApp = useCallback(
    (appName: string) => {
      const provider =
        index[appName].providers[
          defaultProviders[appName] ?? Object.keys(index[appName].providers)[0]
        ];
      const fileName = FilesModule.buildFileName(appName, provider.version);
      setUpdating((prev) => ({ ...prev, [appName]: fileName }));
      addDownload(fileName, provider.download, undefined, (path) => {
        setUpdating((prev) => {
          const { [appName]: _, ...rest } = prev;
          return rest;
        });
        if (installAfterDownload) {
          FilesModule.installApk(path);
        } else {
          openToast(
            interpolate(translations["$1 finished downloading"], appName),
            undefined,
            {
              label: translations["Install"],
              onPress: () => FilesModule.installApk(path),
            }
          );
        }
      });
    },
    [translations, defaultProviders, index, installAfterDownload]
  );

  const refreshUpdates = useCallback(() => {
    refresh({ index, defaultProviders });
  }, [index, defaultProviders]);

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(refreshUpdates, 2500);
      return () => clearInterval(interval);
    }, [refreshUpdates])
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight:
        updates.length > 0
          ? () => (
              <Button onPress={() => updates.forEach(updateApp)}>
                {translations["Update All"]}
              </Button>
            )
          : undefined,
    });

    setUpdating((prev) => {
      const filtered = Object.fromEntries(
        Object.entries(prev).filter(([key]) => updates.includes(key))
      );
      return Object.keys(filtered).length === Object.keys(prev).length
        ? prev
        : filtered;
    });
  }, [updates, updateApp, translations, navigation]);

  const renderItem = useCallback(
    (item: ListRenderItemInfo<string>) => (
      <UpdateItem
        key={item.item}
        appName={item.item}
        fileName={updating[item.item] ?? null}
        updateApp={updateApp}
      />
    ),
    [updating, updateApp]
  );

  const EmptyComponent = useMemo(
    () => (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Icon source="emoticon-sad" size={50} />
        <Text variant="bodyLarge">{translations["No updates available"]}</Text>
      </View>
    ),
    [translations]
  );

  return (
    <FlatList
      data={updates}
      renderItem={renderItem}
      keyExtractor={(item) => item}
      refreshControl={ThemedRefreshControl(theme, {
        onRefresh: refreshUpdates,
        refreshing: false,
      })}
      ListEmptyComponent={EmptyComponent}
    />
  );
}
