import {Linking, ScrollView, View} from 'react-native';
import {Button, Dialog, Portal, ProgressBar, Text} from 'react-native-paper';
import {useDialogsProps} from '@/states/temporary/dialogs';
import React from 'react';
import {useApp} from '@/states/temporary/app';
import FilesModule from '@/lib/files';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useTheme} from '@/theme';

export default function NewVersionDialog({
  activeDialog,
  defaultDialogProps,
  openDialog,
  closeDialog,
}: useDialogsProps) {
  const [progress, setProgress] = React.useState(0);
  const info = useApp(state => state.info);
  const progressHeight = useSharedValue(0);
  const theme = useTheme();

  const update = async () => {
    progressHeight.value = withTiming(10, {duration: 500});
    const path = FilesModule.correctPath('updateme.apk');
    try {
      if (await ReactNativeBlobUtil.fs.exists(path))
        await ReactNativeBlobUtil.fs.unlink(path);
    } catch {}
    ReactNativeBlobUtil.config({
      fileCache: true,
      path,
    })
      .fetch('GET', info.download, {})
      .progress((received, total) => {
        setProgress(parseFloat(received) / parseFloat(total));
      })
      .then(res => {
        setProgress(1);
        FilesModule.installApk(res.path());
        progressHeight.value = withTiming(0, {duration: 500});
        setTimeout(() => {
          setProgress(0);
        }, 500);
      });
  };

  return (
    <Portal>
      <Dialog
        style={{position: 'relative'}}
        visible={activeDialog === 'newVersion'}
        onDismiss={closeDialog}
        dismissable={false}
        dismissableBackButton={false}>
        <Dialog.Title>{`Update Me v${info.version} is available!`}</Dialog.Title>
        <Dialog.Content
          style={{
            alignItems: 'center',
            display: 'flex',
            marginTop: 20,
            marginBottom: 20,
            gap: 20,
          }}>
          <View
            style={{
              width: 300,
              height: 100,
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              display: 'flex',
            }}>
            <Carousel
              width={300}
              height={100}
              loop
              autoPlay={true}
              autoPlayInterval={4000}
              data={info.releaseNotes ?? []}
              renderItem={({item}) => (
                <View
                  key={item.title}
                  style={{
                    width: 300,
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    alignContent: 'center',
                  }}>
                  <Text
                    variant="titleMedium"
                    style={{
                      textAlign: 'center',
                    }}>
                    {item.title}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{
                      textAlign: 'center',
                    }}>
                    {item.description}
                  </Text>
                </View>
              )}
            />
            <Animated.View
              style={{
                width: 300,
                marginBottom: -25,
                height: progressHeight,
                overflow: 'hidden',
              }}>
              <ProgressBar
                animatedValue={progress}
                color={theme.schemedTheme.primary}
                style={{
                  height: 10,
                  borderRadius: 5,
                }}
              />
            </Animated.View>
          </View>
        </Dialog.Content>
        <Dialog.Actions
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Button onPress={() => Linking.openURL(info.download)}>
            Download manually
          </Button>
          <Button onPress={update}>Update</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
