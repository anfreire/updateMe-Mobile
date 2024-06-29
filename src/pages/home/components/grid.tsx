import {List, Text, TouchableRipple} from 'react-native-paper';
import {Dimensions, Image, View} from 'react-native';
import {useEffect, useState} from 'react';
import {HomeScreenChildProps} from '..';
import {useTheme, useThemeProps} from '@/theme';

interface RowProps extends HomeScreenChildProps {
  tileWidth: number;
  apps: string[];
  theme: useThemeProps;
  iRow: number;
}

const Row = (props: RowProps) => (
  <View
    style={{
      marginTop: props.iRow === 0 ? 10 : 5,
      marginBottom: props.iRow === props.filteredApps.length - 1 ? 10 : 5,
      marginHorizontal: 10,
      flexDirection: 'row',
      gap: 10,
    }}>
    {props.apps.map((app, i) => (
      <TouchableRipple
        onPress={_ => {
          props.setCurrApp(app);
          props.navigation.navigate('App-Home' as never);
        }}
        key={app}
        style={{
          aspectRatio: 1,
          gap: 10,
          width: props.tileWidth,
          elevation: 1,
          backgroundColor: props.theme.schemedTheme.elevation.level1,
          borderColor: props.theme.schemedTheme.outlineVariant,
          borderWidth: 1,
          borderRadius: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <>
          <Image
            resizeMode="contain"
            style={{
              width: 40,
              height: 40,
            }}
            source={{uri: props.index[app].icon}}
          />
          <Text
            style={{
              textAlign: 'center',
              flexWrap: 'wrap',
              paddingHorizontal: 10,
              fontSize: 16,
            }}>
            {app}
          </Text>
        </>
      </TouchableRipple>
    ))}
  </View>
);

export default function HomeGrid(props: HomeScreenChildProps) {
  const [rowApps, setRowApps] = useState<string[][]>([]);
  const [width, setWidth] = useState(Dimensions.get('window').width);
  const [tileWidth, setTileWidth] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setWidth(Dimensions.get('window').width);
    };

    const subscription = Dimensions.addEventListener('change', handleResize);

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const rowCount = Math.floor(width / 125);
    const margins = (rowCount + 1) * 10;
    setTileWidth((width - margins) / rowCount);
    const newRows = [] as string[][];
    for (let i = 0; i < props.filteredApps.length; i += rowCount) {
      newRows.push(props.filteredApps.slice(i, i + rowCount));
    }
    setRowApps(newRows);
  }, [props.filteredApps, width]);

  return rowApps.map((apps, i) => (
    <Row
      tileWidth={tileWidth}
      key={i}
      apps={apps}
      theme={theme}
      iRow={i}
      {...props}
    />
  ));
}
