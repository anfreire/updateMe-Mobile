import * as React from 'react';
import {useTranslations} from '@/states/persistent/translations';
import {useUpdates} from '@/states/computed/updates';
import {useSession} from '@/states/runtime/session';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '@/types/navigation';

export function useHomeBanner() {
  const interpolate = useTranslations(state => state.interpolate);
  const updates = useUpdates(state => state.updates);
  const [bannerDismissed, activateFlag] = useSession(state => [
    state.flags.homeBannerDismissed,
    state.activateFlag,
  ]);
  const {navigate} = useNavigation<NavigationProps>();

  const bannerMessage = React.useMemo(() => {
    if (updates.length === 0) return null;
    const updatesCopy = [...updates];
    if (updates.length === 1) {
      return interpolate('There is an update available for $1', updates[0]);
    } else {
      const lastApp = updatesCopy.pop() as string;
      return interpolate(
        'There are updates available for $1 and $2',
        updatesCopy.join(', '),
        lastApp,
      );
    }
  }, [updates]);

  const bannerActions = React.useMemo(
    () => [
      {
        label: 'Dismiss',
        onPress: () => activateFlag('homeBannerDismissed'),
      },
      {
        label: 'View Updates',
        onPress: () => navigate('updates'),
      },
    ],
    [navigate],
  );

  return {bannerDismissed, bannerMessage, bannerActions};
}
