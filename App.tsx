/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import Pages from '@/pages';
import FilesModule from '@/lib/files';
import {useTheme} from '@/theme';
import DrawerWrapper from '@/global/drawer';
import {useSettings} from '@/states/persistent/settings';
import {useDialogs} from '@/states/temporary/dialogs';
import {useApp} from '@/states/temporary/app';
import {useTips} from '@/states/temporary/tips';

function App(): React.JSX.Element {
  const theme = useTheme();
  const deleteOnLeave = useSettings(
    state => state.settings.downloads.deleteOnLeave,
  );
  const [info, localVersion] = useApp(state => [
    state.info,
    state.localVersion,
  ]);
  const openDialog = useDialogs().openDialog;
  const fetchTips = useTips().fetchTips;

  useEffect(() => {
    if (info.version && localVersion && info.version > localVersion)
      openDialog('newVersion');
  }, [info]);

  useEffect(() => {
    const fun = () => deleteOnLeave && FilesModule.deleteAllFiles();
    fun();
    fetchTips();
    return () => {
      fun();
    };
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor={theme.schemedTheme.surfaceContainer}
        barStyle={
          theme.colorScheme === 'dark' ? 'light-content' : 'dark-content'
        }
      />
      <SafeAreaView>
        <View
          style={{
            width: '100%',
            height: '100%',
          }}>
          <DrawerWrapper>
            <Pages />
          </DrawerWrapper>
        </View>
      </SafeAreaView>
    </>
  );
}

export default App;
