import * as React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Button, Dialog, Text} from 'react-native-paper';
import {useDialogs} from '@/states/runtime/dialogs';
import {useTranslations} from '@/states/persistent/translations';
import {useSettings} from '@/states/persistent/settings';
import {Index, useIndex} from '@/states/fetched';
import IgnoredAppsList from './components/IgnoredAppsList';
import IgnoredAppsFilterButton from './components/IgnoredAppsFilterButton';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const DIALOG_KEY = 'ignoredApps' as const;

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function getApps(index: Index, ignoredApps: string[] = []) {
  const ignoredSet = new Set(ignoredApps);

  return Object.fromEntries(
    Object.keys(index).map(provider => [provider, ignoredSet.has(provider)]),
  );
}

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useIgnoredAppsDialog() {
  const index = useIndex(state => state.index);
  const [ignoredApps, setSetting] = useSettings(state => [
    state.settings.apps.ignoredApps,
    state.setSetting,
  ]);
  const translations = useTranslations(state => state.translations);
  const [activeDialog, closeDialog] = useDialogs(state => [
    state.activeDialog,
    state.closeDialog,
  ]);

  const [apps, setApps] = React.useState(getApps(index, ignoredApps));
  const [filteredApps, setFilteredApps] = React.useState(apps);
  const {height: screenHeight} = useWindowDimensions();

  const listDynamicStyle = React.useMemo(
    () => ({height: screenHeight * 0.6}),
    [screenHeight],
  );

  const labels = React.useMemo(
    () => ({
      title: translations['Updates Manager'],
      save: translations['Save'],
      cancel: translations['Cancel'],
    }),
    [translations],
  );

  const handleToggle = React.useCallback((provider: string) => {
    setApps(prev => ({
      ...prev,
      [provider]: !prev[provider],
    }));
  }, []);

  const handleSave = React.useCallback(() => {
    setSetting(
      'apps',
      DIALOG_KEY,
      Object.keys(apps).filter(app => apps[app]),
    );
    closeDialog();
  }, [apps]);

  React.useEffect(() => {
    if (activeDialog !== DIALOG_KEY) return;

    setApps(getApps(index, ignoredApps));
  }, [index, ignoredApps, activeDialog]);

  return {
    activeDialog,
    apps,
    filteredApps,
    labels,
    listDynamicStyle,
    handleToggle,
    handleSave,
    closeDialog,
    setFilteredApps,
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const IgnoredAppsDialog = () => {
  const {
    activeDialog,
    apps,
    filteredApps,
    labels,
    listDynamicStyle,
    handleToggle,
    handleSave,
    closeDialog,
    setFilteredApps,
  } = useIgnoredAppsDialog();

  if (activeDialog !== 'ignoredApps') return null;

  return (
    <Dialog visible onDismiss={closeDialog} style={styles.dialog}>
      <View style={styles.header}>
        <Text variant="headlineSmall">{labels.title}</Text>
        <IgnoredAppsFilterButton
          apps={apps}
          setFilteredApps={setFilteredApps}
        />
      </View>
      <Dialog.ScrollArea style={[styles.listWrapper, listDynamicStyle]}>
        <IgnoredAppsList
          filteredApps={filteredApps}
          handleToggle={handleToggle}
        />
      </Dialog.ScrollArea>
      <Dialog.Actions style={styles.actions}>
        <Button onPress={closeDialog}>{labels.cancel}</Button>
        <Button onPress={handleSave}>{labels.save}</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  dialog: {
    position: 'relative',
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
    padding: 10,
    paddingRight: 16,
    paddingLeft: 26,
  },
  listWrapper: {
    width: '100%',
    paddingHorizontal: 0,
    margin: 0,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 0,
    justifyContent: 'space-around',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(IgnoredAppsDialog);
