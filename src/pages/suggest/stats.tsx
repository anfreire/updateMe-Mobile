import {useDialogs} from '@/states/temporary/dialogs';
import {useToast} from '@/states/temporary/toast';
import {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Card, IconButton, ProgressBar, Text} from 'react-native-paper';

export default function SuggestionsStats() {
  const [stats, setStats] = useState<
    {app: string; count: number; percentage: number}[]
  >([]);
  const openToast = useToast().openToast;
  const showDialog = useDialogs().openDialog;

  useEffect(() => {
    fetch('https://updateme.fortunacasino.store/suggestions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response =>
        response.json().then(data => {
          console.log(data);
          setStats(data);
        }),
      )
      .catch(() => openToast('Failed to fetch suggestions stats', 'error'));

    return () => {
      setStats([]);
    };
  }, []);

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'transparent',
      }}>
      <ScrollView style={{width: '100%'}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            marginBottom: 50,
            marginTop: 10,
            gap: 30,
            backgroundColor: 'transparent',
          }}>
          <Card
            mode="elevated"
            contentStyle={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: 30,
              marginTop: -10,
              paddingBottom: 20,
            }}
            elevation={2}>
            <Text variant="titleLarge">App Suggestions</Text>
          </Card>

          <Card mode="elevated" style={{width: '80%'}} elevation={2}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: 10,
                paddingTop: 30,
                position: 'relative',
              }}>
              <IconButton
                icon="information"
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                }}
                onPress={() =>
                  showDialog({
                    title: 'App Suggestions',
                    content:
                      'This list shows the suggested apps by users. Apps with the highest number of suggestions will be prioritized for addition to the app list.',
                    actions: [
                      {
                        title: 'Ok',
                        action: () => {},
                      },
                    ],
                  })
                }
              />
              {stats.map(value => (
                <View
                  key={value.app}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    padding: 10,
                    margin: 10,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      gap: 10,
                      paddingRight: 20,
                    }}>
                    <Text
                      variant="titleSmall"
                      style={{width: '100%', textAlign: 'center'}}>
                      {value.app}
                    </Text>
                    <View style={{display: 'flex', justifyContent: 'center'}}>
                      <Text
                        style={{
                          color: 'grey',
                        }}>
                        {value.count}
                      </Text>
                    </View>
                  </View>
                  <View style={{flex: 2, width: '100%'}}>
                    <ProgressBar
                      style={{height: 6}}
                      animatedValue={value.percentage}
                    />
                  </View>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
