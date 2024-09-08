import * as React from 'react';
import {Banner} from 'react-native-paper';
import {useSession} from '@/states/runtime/session';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '@/types/navigation';
import {useUpdates} from '@/states/computed/updates';

const makeUpdatesMessage = (updates: string[]) => {
  const updatesCopy = [...updates];
  if (updates.length === 1) {
    return `There is an update available for ${updates[0]}`;
  } else {
    const lastApp = updatesCopy.pop();
    return (
      `There are updates available for ${updatesCopy.join(', ')}` +
      ` and ${lastApp}`
    );
  }
};

const HomeBanner = () => {
  const [bannerDismissed, activateFlag] = useSession(state => [
    state.flags.homeBannerDismissed,
    state.activateFlag,
  ]);
  const updates = useUpdates(state => state.updates);
  const {navigate} = useNavigation<NavigationProps>();

  const updatesMessage = React.useMemo(
    () => makeUpdatesMessage(updates),
    [updates],
  );

  if (!updatesMessage) return null;

  return (
    <Banner
      visible={!bannerDismissed}
      actions={[
        {
          label: 'Dismiss',
          onPress: () => activateFlag('homeBannerDismissed'),
        },
        {
          label: 'View Updates',
          onPress: () => navigate('updates'),
        },
      ]}>
      {updatesMessage}
    </Banner>
  );
};

HomeBanner.displayName = 'HomeBanner';

export default HomeBanner;
