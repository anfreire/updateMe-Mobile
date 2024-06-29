import {List} from 'react-native-paper';
import {Image, View} from 'react-native';
import {HomeScreenChildProps} from '..';
import {useTheme} from '@/theme';

export default function HomeList(props: HomeScreenChildProps) {
  const theme = useTheme();
  return props.filteredApps.map((app, i) => (
    <List.Item
      key={app}
      onPress={_ => {
        props.setCurrApp(app);
        props.navigation.navigate('App-Home' as never);
      }}
      title={app}
      style={{
        paddingLeft: 20,
        paddingVertical: 15,
        borderColor: theme.schemedTheme.outlineVariant,
        borderWidth: 1,
        borderRadius: 20,
        marginTop: i === 0 ? 10 : 5,
        margin: 5,
        marginHorizontal: 10,
        marginBottom: i === props.filteredApps.length - 1 ? 10 : 5,
        elevation: 1,
        backgroundColor: theme.schemedTheme.elevation.level1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      titleStyle={{
        fontSize: 18,
      }}
      left={_ => (
        <Image
          resizeMode="contain"
          style={{
            width: 30,
            height: 30,
          }}
          source={{uri: props.index[app].icon}}
        />
      )}
    />
  ));
}
