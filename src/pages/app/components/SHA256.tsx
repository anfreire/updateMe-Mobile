import { useToast } from '@/states/temporary/toast';
import Clipboard from '@react-native-clipboard/clipboard';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {IconButton, Text} from 'react-native-paper';

export default function SHA256({
  appName,
  provider,
  sha256,
}: {
  appName: string;
  provider: string;
  sha256: string;
}) {
  const openToast = useToast().openToast;
  return (
    <View
      style={{
        width: 150,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        position: 'relative',
      }}>
      <ScrollView horizontal={true}>
        <Text>{sha256}</Text>
      </ScrollView>
      <IconButton
        style={{
          width: 20,
          height: 20,
        }}
        animated={true}
        onPress={() => {
          Clipboard.setString(sha256);
          openToast(`${appName} from ${provider}'s SHA256 copied`);
        }}
        size={20}
        icon="clipboard-text"
      />
    </View>
  );
}
