import * as React from 'react';
import {Banner} from 'react-native-paper';
import {useTranslations} from '@/states/persistent/translations';
import {useUpdates} from '@/states/computed/updates';
import {useSession} from '@/states/runtime/session';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '@/types/navigation';

/*******************************************************************************
 *                                    LOGIC                                    *
 *******************************************************************************/

function useHomeBanner() {
  const interpolate = useTranslations(state => state.interpolate);
  const updates = useUpdates(state => state.updates);
  const [bannerDismissed, activateFlag] = useSession(state => [
    state.flags.homeBannerDismissed,
    state.activateFlag,
  ]);
  const {navigate} = useNavigation<NavigationProps>();

  const bannerMessage = React.useMemo(() => {
    if (bannerDismissed || updates.length === 0) return '';
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
  }, [bannerDismissed, updates]);

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

  const bannerVisible = !bannerDismissed && bannerMessage !== '';

  return {bannerVisible, bannerMessage, bannerActions};
}

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

const HomeBanner = () => {
  const {bannerVisible, bannerMessage, bannerActions} = useHomeBanner();

  return (
    <Banner visible={bannerVisible} actions={bannerActions}>
      {bannerMessage}
    </Banner>
  );
};

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default React.memo(HomeBanner);
