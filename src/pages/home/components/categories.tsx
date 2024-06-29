import {useEffect, useState} from 'react';
import {List} from 'react-native-paper';
import {Image} from 'react-native';
import {HomeScreenChildProps} from '..';
import MultiIcon from '@/components/multiIcon';

export default function HomeCategories(props: HomeScreenChildProps) {
  const [filteredCategories, setFilteredCategories] = useState<
    Record<string, string[]>
  >({});
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  useEffect(() => {
    let newCategories = {} as any;
    if (props.filteredApps.length == Object.keys(props.index).length) {
      setFilteredCategories(
        Object.fromEntries(
          Object.entries(props.categories).map(([category, value]) => [
            category,
            value.apps,
          ]),
        ),
      );
      setOpenCategories([]);
      return;
    }
    for (let category in props.categories) {
      const categoryApps = props.categories[category]['apps'].filter(app =>
        props.filteredApps.includes(app),
      );
      if (categoryApps.length == 0) continue;
      newCategories[category] = categoryApps;
    }
    setFilteredCategories(newCategories);
    setOpenCategories(Object.keys(newCategories));
  }, [props.filteredApps]);

  return (
    <List.Section>
      {Object.keys(filteredCategories).map(category => (
        <List.Accordion
          key={category}
          title={category}
          expanded={openCategories.includes(category)}
          onPress={_ => {
            if (openCategories.includes(category)) {
              setOpenCategories(openCategories.filter(c => c !== category));
            } else {
              setOpenCategories([...openCategories, category]);
            }
          }}
          left={_props => (
            <MultiIcon
              {..._props}
              size={20}
              type={
                (props.categories[category]['type'] as any) ??
                'material-community'
              }
              name={props.categories[category]['icon']}
            />
          )}>
          {filteredCategories[category].map(app => (
            <List.Item
              onPress={_ => {
                props.setCurrApp(app);
                props.navigation.navigate('App-Home' as never);
              }}
              key={app}
              title={app}
              style={{
                paddingLeft: 25,
              }}
              left={_ => (
                <Image
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                  }}
                  source={{uri: props.index[app]?.icon}}
                />
              )}
            />
          ))}
        </List.Accordion>
      ))}
    </List.Section>
  );
}
