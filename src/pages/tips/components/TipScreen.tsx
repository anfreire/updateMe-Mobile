import LoadingView from '@/components/loadingView';
import {useNestedCurrPageEffect} from '@/hooks/useCurrPageEffect';
import {useTips} from '@/states/fetched/tips';
import {Page, RouteProps} from '@/types/navigation';
import {useRoute} from '@react-navigation/native';
import * as React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import TipPage from './TipPage';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'tip';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

const useTipScreen = () => {
  const tips = useTips(state => state.tips);
  const {params} = useRoute<RouteProps>();
  const [wasTouched, setWasTouched] = React.useState(false);
  const dimensions = useWindowDimensions();

  const tipTitle = params && 'tip' in params ? params.tip : undefined;

  const tipContent = React.useMemo(() => {
    if (!tipTitle) {
      return null;
    }
    return tips[tipTitle].content;
  }, [tipTitle, tips]);

  const registerTouch = React.useCallback(() => {
    setWasTouched(prev => prev || true);
  }, []);

  useNestedCurrPageEffect(CURR_PAGE, {tip: tipTitle});

  return {tipContent, dimensions, wasTouched, registerTouch};
};

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const TipScreen = () => {
  const {tipContent, dimensions, wasTouched, registerTouch} = useTipScreen();

  const renderItem = React.useCallback(
    ({item}: {item: {image: string; description: string}}) => (
      <TipPage
        image={item.image}
        description={item.description}
        pageDimensions={dimensions}
        onTouchStart={registerTouch}
      />
    ),
    [dimensions, registerTouch],
  );

  if (!tipContent) {
    return <LoadingView />;
  }

  return (
    <Carousel
      loop={false}
      style={styles.carousel}
      autoPlay={!wasTouched}
      autoPlayInterval={5000}
      data={tipContent}
      renderItem={renderItem}
      width={dimensions.width}
      height={dimensions.height}
      mode="parallax"
    />
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  carousel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default TipScreen;
