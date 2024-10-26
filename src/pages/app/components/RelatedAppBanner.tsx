import * as React from 'react';
import {Translation} from '@/types/translations';
import {CurrAppProps} from '@/hooks/useCurrApp';
import {useVersions} from '@/states/computed/versions';
import {useUpdates} from '@/states/computed/updates';
import {useSession} from '@/states/runtime/session';
import {useTranslations, interpolate} from '@/states/persistent/translations';
import {Banner} from 'react-native-paper';
import {NavigationProps} from '@/types/navigation';
import {useNavigation} from '@react-navigation/native';

/*******************************************************************************
 *                                  CONSTANTS                                  *
 *******************************************************************************/

const BannerAppsKeys = [
  'missingDependencies',
  'outdatedDependencies',
  'outdatedComplementaryApps',
] as const;

const Messages: Record<
  BannerAppKey,
  Record<'singular' | 'plural', Translation>
> = {
  missingDependencies: {
    singular: 'This app is missing the dependency $1',
    plural: 'This app is missing the dependencies $1 and $2',
  },
  outdatedDependencies: {
    singular: 'This app has an outdated dependency $1',
    plural: 'This app has outdated dependencies $1 and $2',
  },
  outdatedComplementaryApps: {
    singular: 'This app has an outdated complementary app $1',
    plural: 'This app has outdated complementary apps $1 and $2',
  },
};

/*******************************************************************************
 *                                    TYPES                                    *
 *******************************************************************************/

type BannerAppKey = (typeof BannerAppsKeys)[number];

type BannerData = Record<BannerAppKey, string[]>;

/*******************************************************************************
 *                                    UTILS                                    *
 *******************************************************************************/

function generateMessage(
  data: BannerData,
  appsDismissed: string[],
  currAppTitle: string,
  translations: Record<Translation, string>,
): string | null {
  if (appsDismissed.includes(currAppTitle)) return null;

  for (const key of BannerAppsKeys) {
    const apps = data[key].filter(app => !appsDismissed.includes(app));
    if (apps.length === 0) continue;

    const messageKey = apps.length === 1 ? 'singular' : 'plural';
    const message = Messages[key][messageKey] || Messages[key][messageKey];

    return apps.length === 1
      ? interpolate(translations[message], apps[0])
      : interpolate(
          translations[message],
          apps.slice(0, -1).join(', '),
          apps.slice(-1)[0],
        );
  }

  return null;
}

/*******************************************************************************
 *                                     HOOK                                    *
 *******************************************************************************/

const useRelatedAppsBanner = (currApp: CurrAppProps) => {
  const versions = useVersions(state => state.versions);
  const updates = useUpdates(state => state.updates);
  const [appsDismissed, addTracker] = useSession(state => [
    state.trackers.appsBannerDismissed,
    state.addTracker,
  ]);
  const translations = useTranslations(state => state.translations);
  const {navigate, setParams} = useNavigation<NavigationProps>();

  const data: BannerData = React.useMemo(
    () => ({
      missingDependencies: currApp.depends.filter(
        dep => versions[dep] === null,
      ),
      outdatedDependencies: currApp.depends.filter(dep =>
        updates.includes(dep),
      ),
      outdatedComplementaryApps: currApp.complements.filter(complement =>
        updates.includes(complement),
      ),
    }),
    [currApp.depends, currApp.complements, versions, updates],
  );

  const message = React.useMemo(
    () => generateMessage(data, appsDismissed, currApp.title, translations),
    [data, appsDismissed, currApp.title, translations],
  );

  const updateLabel = React.useMemo(
    () =>
      data.missingDependencies.length
        ? translations['View dependency']
        : translations['View updates'],
    [data, translations],
  );

  const dismissLabel = translations['Dismiss'];

  const handleUpdate = React.useCallback(() => {
    if (data.missingDependencies.length > 0) {
      setParams({app: data.missingDependencies[0]});
    } else {
      navigate('updates');
    }
  }, [data, navigate, setParams]);

  const handleDismiss = React.useCallback(() => {
    addTracker('appsBannerDismissed', currApp.title);
  }, [currApp.title]);

  return {
    message,
    data,
    handleUpdate,
    handleDismiss,
    updateLabel,
    dismissLabel,
  };
};

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

interface RelatedAppsBannerProps {
  currApp: CurrAppProps;
}

const RelatedAppsBanner = ({currApp}: RelatedAppsBannerProps) => {
  const {message, handleUpdate, handleDismiss, updateLabel, dismissLabel} =
    useRelatedAppsBanner(currApp);

  return (
    <Banner
      visible={message !== null}
      actions={[
        {
          label: dismissLabel,
          onPress: handleDismiss,
        },
        {
          label: updateLabel,
          onPress: handleUpdate,
        },
      ]}>
      {message}
    </Banner>
  );
};

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

// export default RelatedAppsBanner;
export default React.memo(RelatedAppsBanner);
