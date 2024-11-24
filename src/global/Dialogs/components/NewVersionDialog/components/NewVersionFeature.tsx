import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {CarouselRenderItem} from 'react-native-reanimated-carousel';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

type NewVersionFeatureProps = {
  title: string;
  description: string;
};

const NewVersionFeature: CarouselRenderItem<NewVersionFeatureProps> = ({
  item,
}) => (
  <View key={item.title} style={styles.carouselItem}>
    <Text variant="titleMedium" style={styles.carouselTitle}>
      {item.title}
    </Text>
    <Text variant="bodyMedium" style={styles.carouselDescription}>
      {item.description}
    </Text>
  </View>
);

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  carouselItem: {
    width: 300,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignContent: 'center',
  },
  carouselTitle: {
    textAlign: 'center',
  },
  carouselDescription: {
    textAlign: 'center',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default NewVersionFeature;
