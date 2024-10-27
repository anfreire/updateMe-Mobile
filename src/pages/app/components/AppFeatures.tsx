import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Card} from 'react-native-paper';
import {useTranslations} from '@/states/persistent/translations';
import Carousel from 'react-native-reanimated-carousel';

/*******************************************************************************
 *                                    UTILS                                    *
 *******************************************************************************/

const renderItem = ({item}: {item: string}) => (
  <View style={styles.item}>
    <Text variant="bodyMedium" style={styles.text}>
      {item}
    </Text>
  </View>
);

/*******************************************************************************
 *                                     HOOK                                    *
 *******************************************************************************/

const useAppFeatures = (features: string[]) => {
  const translations = useTranslations(state => state.translations);

  const titleLabel = translations['Features'];

  const isMultipleFeatures = features.length > 1;

  return {titleLabel, isMultipleFeatures};
};

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

interface AppFeaturesProps {
  features: string[];
}

const AppFeatures = ({features}: AppFeaturesProps) => {
  const {titleLabel, isMultipleFeatures} = useAppFeatures(features);

  return (
    <Card contentStyle={styles.card}>
      <Text variant="titleLarge">{titleLabel}</Text>
      <Carousel
        width={300}
        height={50}
        loop
        enabled={isMultipleFeatures}
        autoPlay={isMultipleFeatures}
        data={features}
        renderItem={renderItem}
      />
    </Card>
  );
};

/*******************************************************************************
 *                                    STYLES                                   *
 *******************************************************************************/

const styles = StyleSheet.create({
  card: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 20,
    gap: 10,
  },
  item: {
    width: 300,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default React.memo(AppFeatures);
