import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Icon, Text} from 'react-native-paper';
import {useDefaultProviders} from '@/states/persistent/defaultProviders';
import {useVersions} from '@/states/computed/versions';
import {useThemedRefreshControl} from '@/hooks/useThemedRefreshControl';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslations} from '@/states/persistent/translations';
import UpdateItem, {useUpdateItemCallbacks} from './item';
import {useIndex} from '@/states/fetched';
import {useUpdates} from '@/states/computed/updates';
import {NavigationProps, Page} from '@/types/navigation';
import {useCurrPageEffect} from '@/hooks/useCurrPageEffect';
import {useUpdateApp} from './useUpdateApp';
import {FlashList} from '@shopify/flash-list';

/*******************************************************************************
 *                                  CONSTANTS                                  *
 *******************************************************************************/

const CURR_PAGE: Page = 'updates';
const REFRESH_UPDATES_INTERVAL = 1000;

/*******************************************************************************
 *                                     HOOK                                    *
 *******************************************************************************/

function useUpdateScreen() {
  const index = useIndex(state => state.index);
  const populatedDefaultProviders = useDefaultProviders(
    state => state.populatedDefaultProviders,
  );
  const refresh = useVersions(state => state.refresh);
  const updates = useUpdates(state => state.updates);
  const translations = useTranslations(state => state.translations);
  const [updating, setUpdating] = React.useState<Record<string, string>>({});
  const {setOptions} = useNavigation<NavigationProps>();

  const refreshUpdates = React.useCallback(() => {
    refresh(index, populatedDefaultProviders);
  }, [index, populatedDefaultProviders]);

  const updateApp = useUpdateApp({setUpdating});

  const refreshControl = useThemedRefreshControl(refreshUpdates);

  useCurrPageEffect(CURR_PAGE);

  useFocusEffect(
    React.useCallback(() => {
      const interval = setInterval(refreshUpdates, REFRESH_UPDATES_INTERVAL);
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
  }, [updates, updateApp, translations, setOptions]);

  React.useEffect(() => {
    setUpdating(prev => {
      const filtered = Object.fromEntries(
        Object.entries(prev).filter(([key]) => updates.includes(key)),
      );
      return filtered;
    });
  }, [updates]);

  return {updates, refreshControl, updating, updateApp, translations};
}

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

const UpdatesScreen = () => {
  const {updates, refreshControl, updating, updateApp, translations} =
    useUpdateScreen();

  const {buildLeftItem, buildRightItem, handleLongPress, handlePress} =
    useUpdateItemCallbacks(updateApp);

  const renderItem = React.useCallback(
    ({item}: {item: string}) => (
      <UpdateItem
        key={item}
        appName={item}
        fileName={updating[item] ?? null}
        updateApp={updateApp}
        handlePress={handlePress}
        handleLongPress={handleLongPress}
        buildLeftItem={buildLeftItem}
        buildRightItem={buildRightItem}
      />
    ),
    [
      updating,
      updateApp,
      handlePress,
      handleLongPress,
      buildLeftItem,
      buildRightItem,
    ],
  );

  if (updates.length === 0) {
    return (
      <View style={styles.wrapper}>
        <Icon source="emoticon-sad" size={50} />
        <Text variant="bodyLarge">{translations['No updates available']}</Text>
      </View>
    );
  }

  return (
    <FlashList
      data={updates}
      renderItem={renderItem}
      keyExtractor={item => item}
      refreshControl={refreshControl}
      estimatedItemSize={100}
    />
  );
};

/*******************************************************************************
 *                                    STYLES                                   *
 *******************************************************************************/

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default UpdatesScreen;
