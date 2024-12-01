import { Logger } from '@/stores/persistent/logs';
import {
  // eslint-disable-next-line react-native/split-platform-components
  PermissionsAndroid,
  NativeModules,
  type Permission as ReactNativePermission,
  type PermissionStatus,
} from 'react-native';
const {AppManager} = NativeModules;

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type Permission =
  | ReactNativePermission
  | 'android.permission.REQUEST_INSTALL_PACKAGES';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

export const Permissions: Record<string, Permission> = {
  POST_NOTIFICATION: 'android.permission.POST_NOTIFICATIONS',
  UNKNOWN_SOURCES: 'android.permission.REQUEST_INSTALL_PACKAGES',
};

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

async function checkReactNativePermission(
  permission: ReactNativePermission,
): Promise<boolean> {
  return PermissionsAndroid.check(permission);
}

async function requestReactNativePermission(
  permission: ReactNativePermission,
): Promise<PermissionStatus> {
  return PermissionsAndroid.request(permission);
}

async function checkUnknownSourcesPermission(): Promise<boolean> {
  try {
    return await AppManager.isUnknownSourcesEnabled();
  } catch (error) {
    Logger.error(
      'Permissions',
      'isUnknownSourcesEnabled',
      'Failed to check unknown sources status',
      error,
    );
  }
  return false;
}

async function requestUnknownSourcesPermission(): Promise<PermissionStatus> {
  try {
    return await AppManager.requestUnknownSourcesPermission();
  } catch (error) {
    Logger.error(
      'Permissions',
      'requestUnknownSourcesPermission',
      'Failed to request unknown sources permission',
      error,
    );
    return 'denied';
  }
}

/******************************************************************************
 *                                 FUNCTIONS                                  *
 ******************************************************************************/

export async function checkPermission(
  permission: Permission,
): Promise<boolean> {
  switch (permission) {
    case 'android.permission.REQUEST_INSTALL_PACKAGES':
      return checkUnknownSourcesPermission();
    default:
      return checkReactNativePermission(permission);
  }
}

export async function requestPermission(
  permission: Permission,
): Promise<PermissionStatus> {
  switch (permission) {
    case 'android.permission.REQUEST_INSTALL_PACKAGES':
      return requestUnknownSourcesPermission();
    default:
      return requestReactNativePermission(permission);
  }
}
