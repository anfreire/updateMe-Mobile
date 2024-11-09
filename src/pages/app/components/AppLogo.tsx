import * as React from 'react';
import {Image, StyleSheet} from 'react-native';
import {Card, Text} from 'react-native-paper';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const MAX_IMAGE_SIZE = 100;

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const calculateImageSize = (width: number, height: number) => ({
  width: MAX_IMAGE_SIZE * (width / height),
  height: MAX_IMAGE_SIZE,
});

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

const useAppLogo = (title: string, icon: string) => {
  const [imageSize, setImageSize] = React.useState({
    width: MAX_IMAGE_SIZE,
    height: MAX_IMAGE_SIZE,
  });

  React.useEffect(() => {
    Image.getSize(icon, (width, height) =>
      setImageSize(calculateImageSize(width, height)),
    );
  }, [icon]);

  const paddingHorizontal = React.useMemo(
    () => (title.length > 15 ? 40 : 50),
    [title],
  );
  return {imageSize, paddingHorizontal};
};

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface AppLogoProps {
  title: string;
  icon: string;
}

const AppLogo = ({title, icon}: AppLogoProps) => {
  const {imageSize, paddingHorizontal} = useAppLogo(title, icon);

  return (
    <Card contentStyle={[styles.card, {paddingHorizontal}]}>
      <Card.Cover
        resizeMode="contain"
        style={[styles.cardCover, imageSize]}
        source={{uri: icon}}
      />
      <Text style={styles.cardText} variant="headlineLarge">
        {title}
      </Text>
    </Card>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 30,
    paddingBottom: 20,
    gap: 20,
  },
  cardCover: {
    backgroundColor: 'transparent',
  },
  cardText: {
    textAlign: 'center',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

// export default AppLogo;
export default React.memo(AppLogo);
