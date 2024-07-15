import {NativeModules} from 'react-native';

const {NotificationsModule} = NativeModules;

namespace Notifications {
  export function createChannel(
    channelId: string,
    channelName: string,
    channelDescription: string,
  ): Promise<void> {
    return NotificationsModule.createChannel(
      channelId,
      channelName,
      channelDescription,
    );
  }

  export function sendNotification(
    channelId: string,
    title: string,
    message: string,
  ): Promise<number> {
    return NotificationsModule.sendNotification(channelId, title, message);
  }
}

const ChannelsProps = {
  'new-release': {
    name: 'New Release',
    description: 'Notifications for new releases',
  },
  'app-updates': {
    name: 'App Updates',
    description: 'Notifications for app updates',
  },
};

export function sendNotification(
  title: string,
  message: string,
  channelId: keyof typeof ChannelsProps,
) {
  return Notifications.createChannel(
    channelId,
    ChannelsProps[channelId].name,
    ChannelsProps[channelId].description,
  ).then(res => Notifications.sendNotification(channelId, title, message));
}
