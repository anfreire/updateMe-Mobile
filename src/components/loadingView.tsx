import {View} from 'react-native';
import {useTheme} from '@/theme';
import {ActivityIndicator} from 'react-native-paper';

export default function LoadingView() {
  const sourceColor = useTheme().sourceColor;
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator size="large" color={sourceColor} />
    </View>
  );
}
