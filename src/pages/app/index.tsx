import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useThemedRefreshControl} from '@/hooks/useThemedRefreshControl';
import AppProvider from '@/pages/app/components/AppProviders';
import {useVersions} from '@/states/computed/versions';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  DefaultProviders,
  useDefaultProviders,
} from '@/states/persistent/defaultProviders';
import {NavigationProps, Page, RouteProps} from '@/types/navigation';
import {Index, useIndex} from '@/states/fetched';
import {useCurrApp} from '@/hooks/useCurrApp';
import {useCurrPageEffect} from '@/hooks/useCurrPageEffect';
import LoadingView from '@/components/loadingView';
import RelatedAppBanner from './components/RelatedAppBanner';
import AppLogo from './components/AppLogo';
import AppInfo from './components/AppInfo';
import AppFeatures from './components/AppFeatures';

/*******************************************************************************
 *                                  CONSTANTS                                  *
 *******************************************************************************/

const CURR_PAGE: Page = 'app';

/*******************************************************************************
 *                                    UTILS                                    *
 *******************************************************************************/

const refreshVersions = (
  index: Index,
  populatedDefaultProviders: DefaultProviders,
) => useVersions.getState().refresh(index, populatedDefaultProviders);

/*******************************************************************************
 *                                     HOOK                                    *
 *******************************************************************************/

function useAppScreen() {
  const index = useIndex(state => state.index);
  const populatedDefaultProviders = useDefaultProviders(
    state => state.populatedDefaultProviders,
  );
  const {setOptions} = useNavigation<NavigationProps>();
  const {params} = useRoute<RouteProps>();

  const appTitle = React.useMemo(() => {
    return params && 'app' in params ? params.app : null;
  }, [params]);

  const currApp = useCurrApp(appTitle);

  const refresh = React.useCallback(
    () => refreshVersions(index, populatedDefaultProviders),
    [index, populatedDefaultProviders],
  );
  React.useEffect(() => {
    if (!appTitle) {
      return;
    }
    setOptions({title: appTitle});
  }, [appTitle, setOptions]);

  useFocusEffect(
    React.useCallback(() => {
      const interval: NodeJS.Timeout = setInterval(refresh, 2500);

      return () => {
        clearInterval(interval);
      };
    }, [refresh]),
  );

  useCurrPageEffect(CURR_PAGE);

  const refreshControl = useThemedRefreshControl(refresh);

  return {currApp, refreshControl};
}

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

const AppScreen = () => {
  const {currApp, refreshControl} = useAppScreen();

  if (!currApp) {
    return <LoadingView />;
  }

  return (
    <>
      <RelatedAppBanner currApp={currApp} />
      <ScrollView refreshControl={refreshControl}>
        <View style={styles.contentContainer}>
          <AppLogo title={currApp.title} icon={currApp.icon} />
          <AppInfo currApp={currApp} />
          <AppFeatures features={currApp.features} />
          <AppProvider currApp={currApp} />
        </View>
      </ScrollView>
    </>
  );
};

/*******************************************************************************
 *                                    STYLES                                   *
 *******************************************************************************/

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
});

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default React.memo(AppScreen);
