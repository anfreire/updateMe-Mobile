import LoadingView from '@/components/loadingView';
import {useCurrPageEffect} from '@/hooks/useCurrPageEffect';
import {useTips} from '@/states/fetched/tips';
import {NavigationProps, Page, RouteProps} from '@/types/navigation';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import * as React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {IconButton} from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import TipPage from './TipPage';

/*******************************************************************************
 *                                  CONSTANTS                                  *
 *******************************************************************************/

const CURR_PAGE: Page = 'tip';

/*******************************************************************************
 *                                     HOOK                                    *
 *******************************************************************************/

const useTipScreen = () => {
  const tips = useTips(state => state.tips);
  const {params} = useRoute<RouteProps>();
  const {getParent, navigate} = useNavigation<NavigationProps>();
  const [wasTouched, setWasTouched] = React.useState(false);
  const dimensions = useWindowDimensions();

  const tipTitle = params && 'tip' in params ? params.tip : undefined;

  const tipContent = React.useMemo(() => {
    if (!tipTitle) {
      return null;
    }
    return tips[tipTitle].content;
  }, [tipTitle, tips]);

  useFocusEffect(
    React.useCallback(() => {
      if (!tipTitle) {
        return;
      }

      getParent()?.setOptions({
        title: tipTitle,
        headerLeft: () => (
          <IconButton icon="arrow-left" onPress={() => navigate('tips')} />
        ),
      });
    }, [tipTitle, getParent, navigate]),
  );

  const registerTouch = React.useCallback(() => {
    setWasTouched(prev => prev || true);
  }, []);

  useCurrPageEffect(CURR_PAGE);

  return {tipContent, dimensions, wasTouched, registerTouch};
};

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

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

/*******************************************************************************
 *                                    STYLES                                   *
 *******************************************************************************/

const styles = StyleSheet.create({
  carousel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default TipScreen;
