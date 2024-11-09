// eslint-disable-next-line react-native/split-platform-components
import {PermissionsAndroid, NativeModules, Permission} from 'react-native';

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

const grantPostNotification = () =>
  grantAndroidPermission(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

async function grantUnknownSource(): Promise<boolean> {
  const granted = await NativeModules.AppsModule.checkUnknownSource();
  if (!granted) {
    await NativeModules.AppsModule.requestUnknownSource();
    return await NativeModules.AppsModule.checkUnknownSource();
  }
  return granted;
}

export default {
  grantPostNotification,
  grantUnknownSource,
};
