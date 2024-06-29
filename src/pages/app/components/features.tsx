import {Card, List, Text} from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import {View} from 'react-native';
import {AppScreenChildProps} from '..';

export default function AppFeatures(props: AppScreenChildProps) {
  return (
    <Card
      contentStyle={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 20,
        gap: 10,
      }}>
      <Text variant="titleLarge">Features</Text>
      <Carousel
        width={300}
        height={50}
        loop
        autoPlay={true}
        data={props.currApp.features ?? []}
        renderItem={({item}) => (
          <View
            key={item}
            style={{
              width: 300,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <Text
              variant="bodyMedium"
              style={{
                textAlign: 'center',
              }}>
              {item}
            </Text>
          </View>
        )}
      />
    </Card>
  );
}
