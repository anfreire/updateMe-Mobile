import {Banner} from 'react-native-paper';
import {useState} from 'react';
import {HomeScreenChildProps} from '..';

const makeUpdatesMessage = (updates: string[]) => {
  let updatesCopy = [...updates];
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

export default function HomeBanner(props: HomeScreenChildProps) {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  return (
    <Banner
      visible={props.updates.length > 0 && !bannerDismissed}
      actions={[
        {
          label: 'Dismiss',
          onPress: () => setBannerDismissed(true),
        },
        {
          label: 'View Updates',
          onPress: () => props.navigation.navigate('Updates' as never),
        },
      ]}>
      {makeUpdatesMessage(props.updates)}
    </Banner>
  );
}
