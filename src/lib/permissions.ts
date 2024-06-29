import {PermissionsAndroid, NativeModules} from 'react-native';

namespace PermissionsModule {
  export async function grantPostNotification(): Promise<boolean> {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (!granted) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
    return await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  export async function grantUnknownSource(): Promise<boolean> {
    const granted = await NativeModules.AppsModule.checkUnknownSource();
    if (!granted) {
      NativeModules.AppsModule.requestUnknownSource();
    }
    return await NativeModules.AppsModule.checkUnknownSource();
  }

  export async function grantWritePermission(): Promise<boolean> {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (!granted) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
    }
    return await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
  }

  export async function grantReadPermission(): Promise<boolean> {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    if (!granted) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    }
    return await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
  }
}

export default PermissionsModule;
