import {Banner} from 'react-native-paper';
import {useEffect, useState} from 'react';
import {AppScreenChildProps} from '..';
import {useSession} from '@/states/temporary/session';

interface bannerData {
  'Missing dependencies': string[];
  'Outdated dependencies': string[];
  'Outdated complementary apps': string[];
}

const clearedBannerData: bannerData = {
  'Missing dependencies': [],
  'Outdated dependencies': [],
  'Outdated complementary apps': [],
};

const makeAppBannerMessage = (data: bannerData) => {
  const dependencies = data['Missing dependencies'];
  for (const key in data) {
    let prefix = '';
    switch (key) {
      case 'Missing dependencies':
        prefix =
          data[key].length === 1
            ? 'This app is missing the dependency'
            : 'This app is missing the dependencies';
        break;
      case 'Outdated dependencies':
        prefix =
          data[key].length === 1
            ? 'This app has an outdated dependency'
            : 'This app has outdated dependencies';
        break;
      case 'Outdated complementary apps':
        prefix =
          data[key].length === 1
            ? 'This app has an outdated complementary app'
            : 'This app has outdated complementary apps';
        break;
    }
    return (
      prefix +
      ((data as any)[key].length === 1
        ? ` ${dependencies[0]}`
        : ` ${dependencies.splice(0, dependencies.length - 1).join(', ')} and ${
            dependencies[0]
          }`)
    );
  }
  return null;
};

export default function RelatedAppsBanner(props: AppScreenChildProps) {
  const [data, setData] = useState<bannerData>(clearedBannerData);
  const [appsDismissed, addSessionProp] = useSession(state => [
    state.updatesBannerDismissed,
    state.add
  ]);

  useEffect(() => {
    setData(clearedBannerData);
    if (appsDismissed.includes(props.currApp.name) || !props.currApp || !props.currApp.version) return;
    setData(_ => {
      const newData = {
        'Missing dependencies': props.currApp.depends.filter(
          dep => !props.versions[dep],
        ),
        'Outdated dependencies': props.currApp.depends.filter(dep =>
          props.updates.includes(dep),
        ),
        'Outdated complementary apps': props.currApp.complements.filter(
          complement => props.updates.includes(complement),
        ),
      };
      return newData;
    });
  }, [props.currApp]);

  const navigateToUpdates = () => {
    if (data['Missing dependencies'].length > 0) {
      props.setCurrApp(data['Missing dependencies'][0]);
    } else {
      props.navigation.navigate('Updates' as never);
    }
  };
  return (
    <Banner
      visible={Object.values(data).some(arr => arr.length > 0) && !appsDismissed.includes(props.currApp.name)}
      actions={[
        {
          label: 'Dismiss',
          onPress: () => addSessionProp('updatesBannerDismissed',props.currApp.name),
        },
        {
          label:
            data['Missing dependencies'].length > 0
              ? 'View dependency'
              : 'View updates',
          onPress: navigateToUpdates,
        },
      ]}>
      {makeAppBannerMessage(data)}
    </Banner>
  );
}
