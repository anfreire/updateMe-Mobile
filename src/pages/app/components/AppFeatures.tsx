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

const useAppFeatures = () => {
  const translations = useTranslations(state => state.translations);

  return {translations};
};

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

interface AppFeaturesProps {
  features: string[];
}

const AppFeatures = ({features}: AppFeaturesProps) => {
  const {translations} = useAppFeatures();

  return (
    <Card contentStyle={styles.card}>
      <Text variant="titleLarge">{translations['Features']}</Text>
      <Carousel
        width={300}
        height={50}
        loop
        autoPlay={true}
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

// export default AppFeatures;
export default React.memo(AppFeatures);
