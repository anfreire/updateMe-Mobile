import { useVersions } from "@/states/computed/versions";
import { useSettings } from "@/states/persistent/settings";
import BackgroundFetch, { HeadlessEvent } from "react-native-background-fetch";
import { useNotifications } from "@/states/persistent/notifications";
import { useDefaultProviders } from "@/states/persistent/defaultProviders";
import NotificationsModule from "@/lib/notifications";
import { interpolate, useTranslations } from "@/states/persistent/translations";
import { useApp } from "@/states/fetched/app";
import { useIndex } from "@/states/fetched";
import { useUpdates } from "@/states/computed/updates";

async function handleBackgroundNewRelease() {
  const { fetch: fetchLatestApp, getLocalVersion } = useApp.getState();
  const latestApp = await fetchLatestApp();
  if (!latestApp) return;
  const localVersion = await getLocalVersion();
  const { appsVersionsSent, addAppVersionSent } = useNotifications.getState();
  if (
    localVersion >= latestApp.version ||
    (appsVersionsSent["com.updateme"] &&
      appsVersionsSent["com.updateme"] >= latestApp.version)
  )
    return;
  addAppVersionSent("com.updateme", latestApp.version);
  const translations = useTranslations.getState().translations;
  NotificationsModule.sendNotification(
    translations["Time to Update You!"],
    translations["Update Me has a new version available"],
    "new-release"
  );
}

async function handleBackgroundUpdates() {
  const index = await useIndex.getState().fetch();
  if (!index) return;

  const populatedDefaultProviders =
    useDefaultProviders.getState().populatedDefaultProviders;

  const versions = await useVersions
    .getState()
    .refresh(index, populatedDefaultProviders);
  const updates = useUpdates
    .getState()
    .refresh(index, populatedDefaultProviders, versions);
  const { appsVersionsSent, addAppVersionSent } = useNotifications.getState();
  const updatesToSend = updates.filter(
    (update) =>
      !Object.keys(appsVersionsSent).includes(update) ||
      versions[update]! > appsVersionsSent[update]
  );
  if (!updatesToSend.length) return;

  let title = "";
  let message = "";
  const translations = useTranslations.getState().translations;

  if (updatesToSend.length === 1) {
    title = translations["Update Available"];
    message = interpolate(
      translations["Update available for $1"],
      updatesToSend[0]
    );
  } else {
    title = translations["Updates Available"];
    message = interpolate(
      translations["Updates Available for $1 and $2"],
      updatesToSend.slice(0, -1).join(", "),
      updatesToSend.slice(-1)[0]
    );
  }

  updatesToSend.forEach((update) => {
    addAppVersionSent(update, versions[update]!);
  });

  NotificationsModule.sendNotification(title, message, "app-updates");
}

async function backgroundCallback() {
  const { newReleaseNotification, updatesNotification } =
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
    }
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
