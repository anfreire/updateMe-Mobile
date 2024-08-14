import { NativeModules } from "react-native";

interface NotificationsModuleInterface {
	createChannel(
		channelId: string,
		channelName: string,
		channelDescription: string,
	): Promise<void>;
	sendNotification(
		channelId: string,
		title: string,
		message: string,
	): Promise<number>;
}

namespace NotificationsModule {
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

	export async function sendNotification(
		title: string,
		message: string,
		channelId: keyof typeof ChannelsProps,
	) {
		const _ = await NotificationsNativeModule.createChannel(
			channelId,
			ChannelsProps[channelId].name,
			ChannelsProps[channelId].description,
		);
		return await NotificationsNativeModule.sendNotification(
			channelId,
			title,
			message,
		);
	}
}

export default NotificationsModule;
