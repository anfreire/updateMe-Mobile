import { useTranslations } from "@/states/persistent/translations";
import { NativeModules } from "react-native";

interface NotificationsModuleInterface {
  createChannel(
    channelId: string,
    channelName: string,
    channelDescription: string
  ): Promise<void>;
  sendNotification(
    channelId: string,
    title: string,
    message: string
  ): Promise<number>;
}

const NotificationsNativeModule: NotificationsModuleInterface =
  NativeModules.NotificationsModule;

const ChannelsProps = {
  "new-release": {
    name: "New Release",
    description: "Notifications for new releases",
  },
  "app-updates": {
    name: "App Updates",
    description: "Notifications for app updates",
  },
} as const;

async function sendNotification(
  title: string,
  message: string,
  channelId: keyof typeof ChannelsProps
) {
  const translations = useTranslations.getState().translations;

  await NotificationsNativeModule.createChannel(
    channelId,
    translations[ChannelsProps[channelId].name],
    translations[ChannelsProps[channelId].description]
  );
  return await NotificationsNativeModule.sendNotification(
    channelId,
    title,
    message
  );
}

export default {
  sendNotification,
};
