import {View} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native-paper';
import RelatedAppsBanner from './components/relatedAppsBanner';
import {useTheme} from '@/theme';
import useScreenCallback from '@/hooks/screenCallback';
import ThemedRefreshControl from '@/components/refreshControl';
import AppLogo from './components/logo';
import AppInfo from './components/info';
import AppFeatures from './components/features';
import AppProvider from './components/providers';
import {IndexProps, useIndex} from '@/states/temporary';
import {CurrAppProps, useCurrApp} from '@/states/computed/currApp';
import {useVersions} from '@/states/computed/versions';

export interface AppScreenChildProps {
  navigation: any;
  route: any;
  index: IndexProps;
  versions: Record<string, string | null>;
  updates: string[];
  currApp: CurrAppProps;
  setCurrApp: (appName: string | null) => void;
  refresh: () => void;
}

export default function AppScreen({navigation, route}: any) {
  const theme = useTheme();
  const index = useIndex(state => state.index);
  const {versions, updates, refreshVersions} = useVersions(state => ({
    versions: state.versions,
    updates: state.updates,
    refreshVersions: state.refresh,
  }));
  const {currApp, setCurrApp, refreshCurrApp} = useCurrApp(state => ({
    currApp: state.currApp,
    setCurrApp: state.setCurrApp,
    refreshCurrApp: state.refresh,
  }));

  const refresh = () =>
    refreshVersions().then(() => refreshCurrApp({index, versions}));

  useScreenCallback({
    repeat: {
      callback: refresh,
      interval: 2500,
    },
  });

  return (
    <>
      {currApp ? (
        <>
          <RelatedAppsBanner
            navigation={navigation}
            route={route}
            index={index}
            versions={versions}
            updates={updates}
            currApp={currApp}
            setCurrApp={setCurrApp}
            refresh={refresh}
          />
          <ScrollView
            refreshControl={ThemedRefreshControl(theme, {
              refreshing: false,
              onRefresh: refresh,
            })}>
            <View
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
                gap: 20,
              }}>
              <AppLogo
                navigation={navigation}
                route={route}
                index={index}
                versions={versions}
                updates={updates}
                currApp={currApp}
                setCurrApp={setCurrApp}
                refresh={refresh}
              />
              <AppInfo
                navigation={navigation}
                route={route}
                index={index}
                versions={versions}
                updates={updates}
                currApp={currApp}
                setCurrApp={setCurrApp}
                refresh={refresh}
              />
              <AppFeatures
                navigation={navigation}
                route={route}
                index={index}
                versions={versions}
                updates={updates}
                currApp={currApp}
                setCurrApp={setCurrApp}
                refresh={refresh}
              />
              <AppProvider
                navigation={navigation}
                route={route}
                index={index}
                versions={versions}
                updates={updates}
                currApp={currApp}
                setCurrApp={setCurrApp}
                refresh={refresh}
              />
            </View>
          </ScrollView>
        </>
      ) : (
        <View
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color={theme.sourceColor} />
        </View>
      )}
    </>
  );
}
