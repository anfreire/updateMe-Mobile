import * as React from 'react';
import {View, FlatList, ListRenderItemInfo, StyleSheet} from 'react-native';
import {Button, Icon, Text} from 'react-native-paper';
import {useToast} from '@/states/runtime/toast';
import {useDownloads} from '@/states/runtime/downloads';
import {useDefaultProviders} from '@/states/persistent/defaultProviders';
import {useVersions} from '@/states/computed/versions';
import {useThemedRefreshControl} from '@/hooks/useThemedRefreshControl';
import FilesModule from '@/lib/files';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {interpolate, useTranslations} from '@/states/persistent/translations';
import {useSettings} from '@/states/persistent/settings';
import UpdateItem from './item';
import {useIndex} from '@/states/fetched';
import {useUpdates} from '@/states/computed/updates';
import {NavigationProps, Page} from '@/types/navigation';
import {useCurrPageEffect} from '@/hooks/useCurrPageEffect';

const CURR_PAGE: Page = 'updates';

const UpdatesScreen = () => {
  const index = useIndex(state => state.index);
  const populatedDefaultProviders = useDefaultProviders(
    state => state.populatedDefaultProviders,
  );
  const refresh = useVersions(state => state.refresh);
  const updates = useUpdates(state => state.updates);
  const openToast = useToast(state => state.openToast);
  const addDownload = useDownloads(state => state.addDownload);
  const translations = useTranslations(state => state.translations);
  const installAfterDownload = useSettings(
    state => state.settings.downloads.installAfterDownload,
  );
  const [updating, setUpdating] = React.useState<Record<string, string>>({});
  const {setOptions} = useNavigation<NavigationProps>();

  const updateApp = React.useCallback(
    (appName: string) => {
      const fileName = FilesModule.buildFileName(
        appName,
        index[appName].providers[populatedDefaultProviders[appName]].version,
      );
      setUpdating(prev => ({...prev, [appName]: fileName}));
      addDownload(
        fileName,
        index[appName].providers[populatedDefaultProviders[appName]].download,
        undefined,
        path => {
          setUpdating(prev => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {[appName]: _, ...rest} = prev;
            return rest;
          });
          if (installAfterDownload) {
            FilesModule.installApk(path);
          } else {
            openToast(
              interpolate(translations['$1 finished downloading'], appName),
              {
                action: {
                  label: translations['Install'],
                  onPress: () => FilesModule.installApk(path),
                },
              },
            );
          }
        },
      );
    },
    [translations, populatedDefaultProviders, index, installAfterDownload],
  );

  const refreshUpdates = React.useCallback(() => {
    refresh(index, populatedDefaultProviders);
  }, [index, populatedDefaultProviders]);

  useFocusEffect(
    React.useCallback(() => {
      const interval = setInterval(refreshUpdates, 2500);
      return () => clearInterval(interval);
    }, [refreshUpdates]),
  );

  React.useEffect(() => {
    setOptions({
      headerRight:
        updates.length > 0
          ? () => (
              <Button onPress={() => updates.forEach(updateApp)}>
                {translations['Update All']}
              </Button>
            )
          : undefined,
    });

    setUpdating(prev => {
      const filtered = Object.fromEntries(
        Object.entries(prev).filter(([key]) => updates.includes(key)),
      );
      return Object.keys(filtered).length === Object.keys(prev).length
        ? prev
        : filtered;
    });
  }, [updates, updateApp, translations, setOptions]);

  useCurrPageEffect(CURR_PAGE);

  const renderItem = React.useCallback(
    (item: ListRenderItemInfo<string>) => (
      <UpdateItem
        key={item.item}
        appName={item.item}
        fileName={updating[item.item] ?? null}
        updateApp={updateApp}
      />
    ),
    [updating, updateApp],
  );

  const EmptyComponent = React.useMemo(
    () => (
      <View style={styles.wrapper}>
        <Icon source="emoticon-sad" size={50} />
        <Text variant="bodyLarge">{translations['No updates available']}</Text>
      </View>
    ),
    [translations],
  );

  const refreshControl = useThemedRefreshControl(refreshUpdates);

  return (
    <FlatList
      data={updates}
      renderItem={renderItem}
      keyExtractor={item => item}
      refreshControl={refreshControl}
      ListEmptyComponent={EmptyComponent}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});

UpdatesScreen.displayName = 'UpdatesScreen';

export default UpdatesScreen;
