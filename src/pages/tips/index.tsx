import * as React from 'react';
import {useThemedRefreshControl} from '@/hooks/useThemedRefreshControl';
import {useTips} from '@/states/fetched/tips';
import {StyleSheet, View} from 'react-native';
import {List} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '@/types/navigation';
import LoadingView from '@/components/loadingView';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';
import {Page} from '@/types/navigation';
import {useCurrPageEffect} from '@/hooks/useCurrPageEffect';
import {FlashList} from '@shopify/flash-list';

const CURR_PAGE: Page = 'tips';

const chevronRightIcon = (props: {color: string; style?: Style}) => (
  <View style={styles.iconWrapper}>
    <List.Icon {...props} icon="chevron-right" />
  </View>
);

const TipsScreen = () => {
  const [tips, isfetched, fetchTips] = useTips(state => [
    state.tips,
    state.isFetched,
    state.fetch,
  ]);
  const {navigate} = useNavigation<NavigationProps>();

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

  useCurrPageEffect(CURR_PAGE);

  const refreshControl = useThemedRefreshControl(fetchTips, !isfetched);

  if (!isfetched) {
    return <LoadingView />;
  }

  return (
    <FlashList
      data={Object.keys(tips)}
      keyExtractor={item => item}
      renderItem={renderItem}
      refreshControl={refreshControl}
      estimatedItemSize={100}
    />
  );
};

const styles = StyleSheet.create({
  iconWrapper: {justifyContent: 'center', alignItems: 'center'},
  listItem: {fontSize: 13},
});

export default TipsScreen;
