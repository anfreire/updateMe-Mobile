import * as React from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {Button, Dialog} from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import {interpolate, useTranslations} from '@/states/persistent/translations';
import {useApp} from '@/states/fetched/app';
import NewVersionFeature from './components/NewVersionFeature';
import NewVersionDownloadProgress from './components/NewVersionDownloadProgress';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useNewVersionDialog() {
  const latestApp = useApp(state => state.latest);
  const translations = useTranslations(state => state.translations);
  const [handleUpdate, setHandleUpdate] = React.useState(() => () => {});

  const handleManualUpdate = React.useCallback(() => {
    Linking.openURL(latestApp.download);
  }, [latestApp.download]);

  const labels = React.useMemo(
    () => ({
      downloadManually: translations['Download manually'],
      update: translations['Update'],
      title: interpolate(
        translations['Update Me v$1 is available!'],
        latestApp.version,
      ),
    }),
    [translations, latestApp.version],
  );

  return {
    latestApp,
    labels,
    handleManualUpdate,
    handleUpdate,
    setHandleUpdate,
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const NewVersionDialog = () => {
  const {latestApp, labels, handleManualUpdate, handleUpdate, setHandleUpdate} =
    useNewVersionDialog();

  return (
    <Dialog
      visible
      dismissable={false}
      dismissableBackButton={false}
      onDismiss={() => {}}
      style={styles.dialog}>
      <Dialog.Title>{labels.title}</Dialog.Title>
      <Dialog.Content style={styles.content}>
        <View style={styles.carouselContainer}>
          <Carousel
            width={300}
            height={100}
            loop
            autoPlay={true}
            autoPlayInterval={4000}
            data={latestApp.releaseNotes}
            renderItem={NewVersionFeature}
          />
          <NewVersionDownloadProgress setHandleUpdate={setHandleUpdate} />
        </View>
      </Dialog.Content>
      <Dialog.Actions style={styles.actions}>
        <Button onPress={handleManualUpdate}>{labels.downloadManually}</Button>
        <Button onPress={handleUpdate}>{labels.update}</Button>
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
  content: {
    alignItems: 'center',
    display: 'flex',
    marginTop: 20,
    marginBottom: 20,
    gap: 20,
  },
  carouselContainer: {
    width: 300,
    height: 100,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    display: 'flex',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(NewVersionDialog);
