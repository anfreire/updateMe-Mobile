import {useVersions} from '@/states/computed/versions';
import {useSettings} from '@/states/persistent/settings';
import BackgroundFetch, {HeadlessEvent} from 'react-native-background-fetch';
import {useNotifications} from '@/states/persistent/notifications';
import NotificationsModule from '@/lib/notifications';
import {interpolate, useTranslations} from '@/states/persistent/translations';
import {useApp} from '@/states/fetched/app';
import {useIndex} from '@/states/fetched';
import {useUpdates} from '@/states/computed/updates';
import {useInstallations} from '@/states/persistent/installations';
import {useProviders} from '@/states/computed/providers';

async function handleBackgroundNewRelease() {
  const {fetch: fetchLatestApp, getLocalVersion} = useApp.getState();
  const latestApp = await fetchLatestApp();

  if (!latestApp) {
    return;
  }
  const localVersion = await getLocalVersion();
  const {newVersionsNotifications, registerNewVersionNotification} =
    useNotifications.getState();

  if (
    localVersion >= latestApp.version ||
    (newVersionsNotifications['com.updateme'] &&
      newVersionsNotifications['com.updateme'].version >= latestApp.version)
  )
    return;

  registerNewVersionNotification('com.updateme', latestApp.version);

  const translations = useTranslations.getState().translations;

  NotificationsModule.sendNotification(
    translations['Time to Update You!'],
    translations['Update Me has a new version available'],
    'new-release',
  );
}

async function handleBackgroundUpdates() {
  const index = await useIndex.getState().fetch();
  if (!index) return;

  const providersSettings = useSettings.getState().settings.providers;

  const populatedDefaultProviders = useProviders
    .getState()
    .populate(
      index,
      providersSettings.defaultProviders,
      providersSettings.providersOrder,
    );

  const installations = useInstallations.getState().installations;

  const versions = await useVersions
    .getState()
    .refresh(index, populatedDefaultProviders);

  const ignoredApps = useSettings.getState().settings.apps.ignoredApps;

  const updates = useUpdates
    .getState()
    .refresh(
      index,
      populatedDefaultProviders,
      versions,
      installations,
      ignoredApps,
    );

  const {newVersionsNotifications, registerNewVersionNotification} =
    useNotifications.getState();

  const notifiedApps = Object.keys(newVersionsNotifications);

  const updatesToSend = updates.filter(
    update =>
      !notifiedApps.includes(update) ||
      versions[update]! > newVersionsNotifications[update].version ||
      (installations[update] &&
        installations[update].sha256 !==
          index[update]['providers'][populatedDefaultProviders[update]][
            'sha256'
          ]),
  );

  if (!updatesToSend.length) return;

  let title = '';
  let message = '';
  const translations = useTranslations.getState().translations;

  if (updatesToSend.length === 1) {
    title = translations['Update Available'];
    message = interpolate(
      translations['Update available for $1'],
      updatesToSend[0],
    );
  } else {
    title = translations['Updates Available'];
    message = interpolate(
      translations['Updates Available for $1 and $2'],
      updatesToSend.slice(0, -1).join(', '),
      updatesToSend.slice(-1)[0],
    );
  }

  updatesToSend.forEach(update => {
    registerNewVersionNotification(update, versions[update]!);
  });

  NotificationsModule.sendNotification(title, message, 'app-updates');
}

async function backgroundCallback() {
  const {newReleaseNotification, updatesNotification} =
    useSettings.getState().settings.notifications;

  if (newReleaseNotification) {
    await handleBackgroundNewRelease();
  }

  if (updatesNotification) {
    await handleBackgroundUpdates();
  }
}

const initBackgroundTasks = async () =>
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

async function headlessTask(event: HeadlessEvent) {
  const taskId = event.taskId;
  const isTimeout = event.timeout;
  if (isTimeout) {
    BackgroundFetch.finish(taskId);
    return;
  }
  await backgroundCallback();
  BackgroundFetch.finish(taskId);
}

export default {
  headlessTask,
  initBackgroundTasks,
};
