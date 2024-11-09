import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useIndex} from '@/states/fetched';
import {useApp} from '@/states/fetched/app';
import {useCategories} from '@/states/fetched/categories';
import {NavigationProps, Page} from '@/types/navigation';
import LoadingIcon from './components/LoadingIcon';
import {useCurrPageEffect} from '@/hooks/useCurrPageEffect';
import {useTips} from '@/states/fetched/tips';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'loading';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useLoadingScreen() {
  const {reset} = useNavigation<NavigationProps>();
  const fetchIndex = useIndex(state => state.fetch);
  const fetchCategories = useCategories(state => state.fetch);
  const fetchTips = useTips(state => state.fetch);
  const [fetchLatestAppInfo, getLocalVersion] = useApp(state => [
    state.fetch,
    state.getLocalVersion,
  ]);

  const fetchData = React.useCallback(
    async (
      indexFetched = false,
      categoriesFetched = false,
      tipsFetched = false,
    ) => {
      if (!indexFetched && (await fetchIndex()) === null) {
        return fetchData();
      }

      if (!categoriesFetched && (await fetchCategories()) === null) {
        return fetchData(true);
      }

      if (!tipsFetched && (await fetchTips()) === null) {
        return fetchData(true, true);
      }

      if ((await fetchLatestAppInfo()) === null) {
        return fetchData(true, true, true);
      }

      reset({
        index: 0,
        routes: [{name: 'apps-stack'}],
      });
    },
    [reset],
  );

  React.useEffect(() => {
    getLocalVersion().then(() => fetchData());
  }, [fetchData]);

  useCurrPageEffect(CURR_PAGE);
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const LoadingScreen = () => {
  useLoadingScreen();

  return (
    <View style={styles.container}>
      <LoadingIcon />
    </View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default LoadingScreen;
