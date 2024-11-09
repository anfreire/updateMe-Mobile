import {useTheme} from '@/theme';
import * as React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const IMAGE_SCALE = 0.8;

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useTipPage(
  image: string,
  pageDimensions: {width: number; height: number},
) {
  const {schemedTheme} = useTheme();
  const isHorizontal = pageDimensions.width > pageDimensions.height;
  const [imageDimensions, setImageDimensions] = React.useState({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    Image.getSize(image, (width, height) => {
      if (isHorizontal) {
        const imageHeight = pageDimensions.height * IMAGE_SCALE;
        const imageWidth = (width * imageHeight) / height;
        setImageDimensions({width: imageWidth, height: imageHeight});
      } else {
        const imageWidth = pageDimensions.width * IMAGE_SCALE;
        const imageHeight = (height * imageWidth) / width;
        setImageDimensions({width: imageWidth, height: imageHeight});
      }
    });
  }, [pageDimensions, image, isHorizontal]);

  return {schemedTheme, isHorizontal, imageDimensions};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface TipsPageProps {
  image: string;
  description: string;
  pageDimensions: {width: number; height: number};
  onTouchStart: () => void;
}

const TipsPage = ({
  image,
  description,
  pageDimensions,
  onTouchStart,
}: TipsPageProps) => {
  const {schemedTheme, isHorizontal, imageDimensions} = useTipPage(
    image,
    pageDimensions,
  );

  return (
    <View
      onTouchStart={onTouchStart}
      style={[styles.container, isHorizontal && styles.horizontalContainer]}>
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        source={{uri: image}}
        style={[styles.image, imageDimensions]}
      />
      <View
        style={[
          styles.wrapper,
          {backgroundColor: schemedTheme.elevation.level1},
          isHorizontal && styles.horizontalWrapper,
        ]}>
        <Text
          variant="bodyLarge"
          style={[styles.text, isHorizontal && styles.horizontalText]}>
          {description}
        </Text>
      </View>
    </View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 20,
  },
  horizontalContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  wrapper: {
    padding: 10,
    elevation: 1,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalWrapper: {
    width: '50%',
    marginLeft: 0,
  },
  image: {
    borderRadius: 5,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
  },
  horizontalText: {
    textAlign: 'center',
    fontSize: 18,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(TipsPage);
