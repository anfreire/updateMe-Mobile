import * as React from 'react';
import {useTips} from '@/states/fetched/tips';
import {StyleSheet, View} from 'react-native';
import {List} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '@/types/navigation';
import LoadingView from '@/components/loadingView';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import {Page} from '@/types/navigation';
import {useNestedCurrPageEffect} from '@/hooks/useCurrPageEffect';
import {FlashList} from '@shopify/flash-list';
import {useRefreshControlBuilder} from '@/hooks/useRefreshControlBuilder';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'tips';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const chevronRightIcon = (props: {color: string; style?: Style}) => (
  <View style={styles.iconWrapper}>
    <List.Icon {...props} icon="chevron-right" />
  </View>
);

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useTipsScreen() {
  const [tips, isfetched, fetchTips] = useTips(state => [
    state.tips,
    state.isFetched,
    state.fetch,
  ]);
  const {navigate} = useNavigation<NavigationProps>();

  const refreshControl = useRefreshControlBuilder(fetchTips, !isfetched);

  useNestedCurrPageEffect(CURR_PAGE);

  return {tips, isfetched, navigate, refreshControl};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const TipsScreen = () => {
  const {tips, isfetched, navigate, refreshControl} = useTipsScreen();

  const renderItem = React.useCallback(
    ({item: tip}: {item: string}) => (
      <List.Item
        title={tip}
        right={chevronRightIcon}
        description={tips[tip].description}
        descriptionStyle={styles.listItem}
        onPress={() => {
          navigate('tip', {tip});
        }}
      />
    ),
    [tips, navigate],
  );

  if (!isfetched) {
    return <LoadingView />;
  }

  return (
    <FlashList
      data={Object.keys(tips)}
      renderItem={renderItem}
      refreshControl={refreshControl}
      estimatedItemSize={124}
    />
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  iconWrapper: {justifyContent: 'center', alignItems: 'center'},
  listItem: {fontSize: 13},
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default TipsScreen;
