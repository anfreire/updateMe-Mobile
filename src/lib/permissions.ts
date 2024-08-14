import { PermissionsAndroid, NativeModules, Permission } from "react-native";

namespace PermissionsModule {
	async function grantAndroidPermission(
		permission: Permission,
	): Promise<boolean> {
		const granted = await PermissionsAndroid.check(permission);
		if (!granted) {
			const result = await PermissionsAndroid.request(permission);
			return result === PermissionsAndroid.RESULTS.GRANTED;
		}
		return granted;
	}

	export const grantPostNotification = () =>
		grantAndroidPermission(
			PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
		);

	export async function grantUnknownSource(): Promise<boolean> {
		const granted = await NativeModules.AppsModule.checkUnknownSource();
		if (!granted) {
			await NativeModules.AppsModule.requestUnknownSource();
			return await NativeModules.AppsModule.checkUnknownSource();
		}
		return granted;
	}
}

export default PermissionsModule;
