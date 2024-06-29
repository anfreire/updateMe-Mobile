import {Card, Text} from 'react-native-paper';
import {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {AppScreenChildProps} from '..';

export default function AppLogo(props: AppScreenChildProps) {
  const [imageSize, setImageSize] = useState({width: 100, height: 100});

  useEffect(() => {
    if (props.currApp) {
      Image.getSize(props.currApp.icon, (width, height) => {
        const ratio = width / height;
        setImageSize({width: 100 * ratio, height: 100});
      });
    }
  }, [props.currApp]);

  return (
    <Card
      contentStyle={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 30,
        paddingBottom: 20,
        paddingHorizontal: props.currApp.name.length > 15 ? 40 : 50,
        gap: 20,
      }}>
      <Card.Cover
        resizeMode="contain"
        style={{
          width: imageSize.width,
          height: imageSize.height,
          backgroundColor: 'transparent',
        }}
        source={{uri: props.currApp.icon}}></Card.Cover>
      <Text variant="headlineLarge">{props.currApp.name}</Text>
    </Card>
  );
}
