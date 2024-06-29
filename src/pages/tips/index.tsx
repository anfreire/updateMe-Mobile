import ThemedRefreshControl from '@/components/refreshControl';
import {useTips} from '@/states/temporary/tips';
import {useTheme} from '@/theme';
import {ScrollView} from 'react-native';
import {List} from 'react-native-paper';

export default function TipsScreen({navigation}: {navigation: any}) {
  const theme = useTheme();
  const {tips, setCurrTip, refresh} = useTips(state => ({
    tips: state.tips,
    setCurrTip: state.setCurrTip,
    refresh: state.fetchTips,
  }));
  return (
    <ScrollView
      refreshControl={ThemedRefreshControl(theme, {onRefresh: refresh})}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
      {Object.keys(tips).map(key => (
        <List.Item
          key={key}
          title={key}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          description={tips[key].description}
          descriptionStyle={{fontSize: 13}}
          onPress={() => {
            setCurrTip(key);
            navigation.navigate('Tips-Tip');
          }}></List.Item>
      ))}
    </ScrollView>
  );
}
