import {useVersions} from '@/states/computed/versions';
import {useSettings} from '@/states/persistent/settings';
import {useIndex} from '@/states/temporary';
import {useApp} from '@/states/temporary/app';
import BackgroundFetch, {HeadlessEvent} from 'react-native-background-fetch';
import notifee from '@notifee/react-native';
import {useBackground} from '@/states/persistent/background';

export const sendNotification = (
  title: string,
  message: string,
  type: 'new-release' | 'app-updates',
) => {
  notifee
    .createChannel({
      id: `updateMe-${type}`,
      name: `Update Me ${type}`,
    })
    .then(channelId => {
      notifee.displayNotification({
        title: title,
        body: message,
        android: {
          smallIcon: 'ic_small_icon',
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });
    });
};

const backgroundCallback = async () => {
  const {background, setBackground} = useBackground.getState();
  if (useSettings.getState().settings.notifications.newReleaseNotification) {
    const localVersion = await useApp.getState().getVersion();
    const info = await useApp.getState().fetchInfo();
    if (!info) return;
    if (
      localVersion < info.version &&
      (!background['Update Me'] || background['Update Me'] < info.version)
    ) {
      setBackground('UpdateMe', info.version);
      sendNotification(
        'Time to Update You!',
        'Update Me has a new version available',
        'new-release',
      );
    }
  }

  if (!useSettings.getState().settings.notifications.updatesNotification)
    return;

  const index = await useIndex.getState().fetchIndex();
  if (!index) return;
  let {updates, versions} = await useVersions.getState().refresh({index});
  const sentUpdates: string[] = [];
  for (const update of updates) {
    if (background[update] && background[update] >= versions[update]!) {
      sentUpdates.push(update);
    } else setBackground(update, versions[update]!);
  }
  updates = updates.filter(update => !sentUpdates.includes(update));
  if (updates && updates.length) {
    let title = '';
    let message = '';
    if (updates.length === 1) {
      title = 'Update Available';
      message = `Update available for ${updates[0]}`;
    } else {
      title = 'Updates Available';
      message = `Updates available for ${updates
        .slice(0, -1)
        .join(', ')} and ${updates.slice(-1)}`;
    }
    sendNotification(title, message, 'app-updates');
  }
};
export const initBackgroundTasks = async () =>
  await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15,
      enableHeadless: true,
      startOnBoot: true,
      stopOnTerminate: false,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
    },
    async (taskId: string) => {
      await backgroundCallback();
      BackgroundFetch.finish(taskId);
    },
    async (taskId: string) => {
      BackgroundFetch.finish(taskId);
    },
  );

export const headlessTask = async (event: HeadlessEvent) => {
  const taskId = event.taskId;
  const isTimeout = event.timeout;
  if (isTimeout) {
    BackgroundFetch.finish(taskId);
    return;
  }
  await backgroundCallback();
  BackgroundFetch.finish(taskId);
};
