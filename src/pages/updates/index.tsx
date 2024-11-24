import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Icon, Text} from 'react-native-paper';
import {useVersions} from '@/states/computed/versions';
import {useRefreshControlBuilder} from '@/hooks/useRefreshControlBuilder';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslations} from '@/states/persistent/translations';
import {useIndex} from '@/states/fetched';
import {useUpdates} from '@/states/computed/updates';
import {NavigationProps, Page} from '@/types/navigation';
import {useCurrPageEffect} from '@/hooks/useCurrPageEffect';
import {useInstall} from '@/hooks/useInstall';
import UpdatesList from './components/UpdatesList';
import {useProviders} from '@/states/computed/providers';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'updates';
const REFRESH_UPDATES_INTERVAL = 1000;

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useUpdateScreen() {
  const [updating, setUpdating] = React.useState<Record<string, string>>({});

  const index = useIndex(state => state.index);
  const populatedDefaultProviders = useProviders(
    state => state.populatedDefaultProviders,
  );
  const translations = useTranslations(state => state.translations);
  const updates = useUpdates(state => state.updates);

  const refreshVersions = useVersions(state => state.refresh);
  const {setOptions} = useNavigation<NavigationProps>();

  const refresh = React.useCallback(() => {
    refreshVersions(index, populatedDefaultProviders);
  }, [index, populatedDefaultProviders]);

  const install = useInstall();

  const updateApp = React.useCallback(
    (appName: string) => {
      install(
        appName,
        index[appName].providers[populatedDefaultProviders[appName]],
        {
          disableNotice: true,
          disableDrawer: true,
          onStart: path => setUpdating(prev => ({...prev, [appName]: path})),
          onFinish: () =>
            setUpdating(prev => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const {[appName]: _, ...rest} = prev;
              return rest;
            }),
        },
      );
    },
    [install, index, populatedDefaultProviders],
  );

  const refreshControl = useRefreshControlBuilder(refresh);

  useCurrPageEffect(CURR_PAGE);

  useFocusEffect(
    React.useCallback(() => {
      const interval = setInterval(refresh, REFRESH_UPDATES_INTERVAL);
      return () => clearInterval(interval);
    }, [refresh]),
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
  }, [updates, updateApp, translations, setOptions]);

  return {updates, refreshControl, updating, updateApp, translations};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const UpdatesScreen = () => {
  const {updates, refreshControl, updating, updateApp, translations} =
    useUpdateScreen();

  if (updates.length === 0) {
    return (
      <View style={styles.wrapper}>
        <Icon source="emoticon-sad" size={50} />
        <Text variant="bodyLarge">{translations['No updates available']}</Text>
      </View>
    );
  }

  return (
    <UpdatesList
      refreshControl={refreshControl}
      updating={updating}
      updateApp={updateApp}
    />
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default UpdatesScreen;
