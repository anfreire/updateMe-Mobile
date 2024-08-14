import { useVersions } from "@/states/computed/versions";
import { useSettings } from "@/states/persistent/settings";
import { useIndex } from "@/states/temporary";
import { useApp } from "@/states/temporary/app";
import BackgroundFetch, { HeadlessEvent } from "react-native-background-fetch";
import {
	useNotifications,
	useNotificationsProps,
} from "@/states/persistent/notifications";
import { useDefaultProviders } from "@/states/persistent/defaultProviders";
import NotificationsModule from "@/lib/notifications";

namespace BackgroundTasksModule {
	async function handleBackgroundNewRelease({
		sentNotifications,
		setSentNotifications,
	}: useNotificationsProps) {
		const info = await useApp.getState().fetchInfo();
		if (!info) return;
		const localVersion = await useApp.getState().getVersion();
		if (
			localVersion >= info.version ||
			(sentNotifications["com.updateme"] &&
				sentNotifications["com.updateme"] >= info.version)
		)
			return;
		setSentNotifications("com.updateme", info.version);
		NotificationsModule.sendNotification(
			"Time to Update You!",
			"Update Me has a new version available",
			"new-release",
		);
	}

	async function handleBackgroundUpdates({
		sentNotifications,
		setSentNotifications,
	}: useNotificationsProps) {
		const index = await useIndex.getState().fetchIndex();
		const defaultProviders =
			useDefaultProviders.getState().defaultProviders;
		if (!index) return;
		let { updates, versions } = await useVersions
			.getState()
			.refresh({ index, defaultProviders });
		const updatesToSend = updates.filter(
			(update) =>
				!Object.keys(sentNotifications).includes(update) ||
				versions[update]! > sentNotifications[update],
		);
		if (updatesToSend && updatesToSend.length) {
			let title = "";
			let message = "";

			if (updatesToSend.length === 1) {
				title = "Update Available";
				message = "Update available for " + updatesToSend[0];
			} else {
				title = "Updates Available";
				message =
					"Updates available for " +
					updatesToSend.slice(0, -1).join(", ") +
					" and " +
					updatesToSend.slice(-1);
			}

			updatesToSend.forEach((update) => {
				setSentNotifications(update, versions[update]!);
			});

			NotificationsModule.sendNotification(title, message, "app-updates");
		}
	}

	async function backgroundCallback() {
		const { sentNotifications, setSentNotifications } =
			useNotifications.getState();
		const { newReleaseNotification, updatesNotification } =
			useSettings.getState().settings.notifications;

		if (newReleaseNotification) {
			await handleBackgroundNewRelease({
				sentNotifications,
				setSentNotifications,
			});
		}

		if (updatesNotification) {
			await handleBackgroundUpdates({
				sentNotifications,
				setSentNotifications,
			});
		}
	}

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

	export async function headlessTask(event: HeadlessEvent) {
		const taskId = event.taskId;
		const isTimeout = event.timeout;
		if (isTimeout) {
			BackgroundFetch.finish(taskId);
			return;
		}
		await backgroundCallback();
		BackgroundFetch.finish(taskId);
	}
}

export default BackgroundTasksModule;
