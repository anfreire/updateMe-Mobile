import LoadingView from '@/components/loadingView';
import {useTips} from '@/states/temporary/tips';
import {useTheme, useThemeProps} from '@/theme';
import {Dimensions, ScrollView, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';

function Step({
  theme,
  content,
  height,
  width,
}: {
  theme: useThemeProps;
  content: {
    image: string;
    description: string;
  };
  height: number;
  width: number;
}) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          gap: 15,
          margin: 20,
          marginVertical: 30,
          width: width + 80,
          padding: 20,
          paddingVertical: 30,
          elevation: 1,
          backgroundColor: theme.schemedTheme.elevation.level1,
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={{uri: content.image}}
          style={{
            width: width,
            height: height,
            borderRadius: 5,
          }}
        />
        <Text
          variant="bodyLarge"
          style={{
            textAlign: 'center',
          }}>
          {content.description}
        </Text>
      </View>
    </View>
  );
}

export default function TipScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const theme = useTheme();
  const {tips, currTip} = useTips(state => ({
    tips: state.tips,
    currTip: state.currTip,
  }));
  const height = Dimensions.get('window').height * 0.65;
  const width = (320 / 711) * height;
  return (
    <>
      {currTip == null ? (
        <LoadingView />
      ) : (
        <ScrollView>
          {tips[currTip as string].content.map((content, index) => (
            <Step
              key={index}
              theme={theme}
              content={content}
              height={height}
              width={width}
            />
          ))}
        </ScrollView>
      )}
    </>
  );
}
