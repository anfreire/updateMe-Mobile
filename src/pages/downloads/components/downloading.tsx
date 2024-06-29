import {IconButton, List, Text, TouchableRipple} from 'react-native-paper';
import {View} from 'react-native';
import {DownloadsScreenChildProps} from '..';
import { useDialogs } from '@/states/temporary/dialogs';
import { useTheme } from '@/theme';

export default function Downloading(props: DownloadsScreenChildProps) {
  const theme = useTheme();
  const openDialog = useDialogs().openDialog;

  return Object.keys(props.downloads).length > 0 ? (
    <List.Section title="Downloading">
      {Object.keys(props.downloads).map((download, index) => (
        <List.Item
          onPress={() =>
            openDialog({
              title: 'Cancel download',
              content: `Are you sure you want to cancel the download of ${download}?`,
              actions: [
                {
                  title: 'Keep downloading',
                  action: () => {},
                },
                {
                  title: 'Cancel',
                  action: () => props.cancelDownload(download),
                },
              ],
            })
          }
          key={index}
          title={download}
          right={_ => (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 0,
                width: 100,
                minHeight: 40,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: theme.schemedTheme.secondary,
                }}>{`${(props.downloads[download].progress * 100).toFixed(
                0,
              )}%`}</Text>
            </View>
          )}
          left={props => (
            <TouchableRipple
              style={{
                position: 'relative',
                width: 20,
                height: 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...props.style,
              }}>
              <IconButton icon="cancel" size={25} />
            </TouchableRipple>
          )}></List.Item>
      ))}
    </List.Section>
  ) : (
    <></>
  );
}
