import * as React from 'react';
import {Banner} from 'react-native-paper';
import {useHomeBanner} from './useHomeBanner';

const HomeBanner = () => {
  const {bannerDismissed, bannerMessage, bannerActions} = useHomeBanner();

  if (!bannerMessage) return null;

  return (
    <Banner visible={!bannerDismissed} actions={bannerActions}>
      {bannerMessage}
    </Banner>
  );
};

export default HomeBanner;
