import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useRefreshControlBuilder} from '@/hooks/useRefreshControlBuilder';
import AppProvider from '@/pages/app/components/AppProviders';
import {useVersions} from '@/states/computed/versions';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import {NavigationProps, Page, RouteProps} from '@/types/navigation';
import {Index, useIndex} from '@/states/fetched';
import {useCurrApp} from '@/hooks/useCurrApp';
import {useNestedCurrPageEffect} from '@/hooks/useCurrPageEffect';
import LoadingView from '@/components/loadingView';
import RelatedAppBanner from './components/RelatedAppBanner';
import AppLogo from './components/AppLogo';
import AppInfo from './components/AppInfo';
import AppFeatures from './components/AppFeatures';
import {
  PopulatedDefaultProviders,
  useProviders,
} from '@/states/computed/providers';
import {useTheme} from '@/theme';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'app';

const REFRESH_INTERVAL = 1000;

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const refreshVersions = (
  index: Index,
  populatedDefaultProviders: PopulatedDefaultProviders,
) => useVersions.getState().refresh(index, populatedDefaultProviders);

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useAppScreen() {
  const index = useIndex(state => state.index);
  const populatedDefaultProviders = useProviders(
    state => state.populatedDefaultProviders,
  );
  const {setOptions} = useNavigation<NavigationProps>();
  const {params} = useRoute<RouteProps>();
  const {schemedTheme} = useTheme();

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
      const interval: NodeJS.Timeout = setInterval(refresh, REFRESH_INTERVAL);
      return () => {
        clearInterval(interval);
      };
    }, [refresh]),
  );

  useNestedCurrPageEffect(CURR_PAGE, {app: appTitle});

  const refreshControl = useRefreshControlBuilder(refresh);

  return {currApp, refreshControl, schemedTheme};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const AppScreen = () => {
  const {currApp, refreshControl, schemedTheme} = useAppScreen();

  if (!currApp) {
    return <LoadingView />;
  }

  return (
    <View style={[styles.container, {backgroundColor: schemedTheme.surface}]}>
      <RelatedAppBanner currApp={currApp} />

      <ScrollView
        refreshControl={refreshControl}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Compact Header Section */}
        <View style={styles.headerSection}>
          <AppLogo title={currApp.title} icon={currApp.icon} />
        </View>

        {/* Primary Action Section */}
        <View style={styles.actionSection}>
          <AppInfo currApp={currApp} />
        </View>

        {/* Secondary Content */}
        <View style={styles.contentSection}>
          {currApp.features && currApp.features.length > 0 && (
            <AppFeatures features={currApp.features} />
          )}

          <AppProvider currApp={currApp} />
        </View>
      </ScrollView>
    </View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  contentSection: {
    paddingHorizontal: 20,
    gap: 20,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(AppScreen);
