import {Logger} from '@/stores/persistent/logs';
import {NativeModules} from 'react-native';
const {AppManager} = NativeModules;

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export interface ApkInfo {
  packageName: string;
  versionName: string;
}

export interface AppInfo extends ApkInfo {
  appName: string;
}

export enum AppInstallError {
  INSTALLATION_ABORTED = 'INSTALLATION_ABORTED',
  INSTALLATION_BLOCKED = 'INSTALLATION_BLOCKED',
  MISSING_PERMISSION = 'MISSING_PERMISSION',
  PACKAGE_CONFLICT = 'PACKAGE_CONFLICT',
  INCOMPATIBLE = 'INCOMPATIBLE',
  INVALID_APK = 'INVALID_APK',
  INSUFFICIENT_STORAGE = 'INSUFFICIENT_STORAGE',
  UNKNOWN = 'UNKNOWN',
}

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function getFileName(path: string): string {
  try {
    return decodeURIComponent(path).split('/').pop() || '';
  } catch {
    return path.split('/').pop() || path;
  }
}

/******************************************************************************
 *                                 FUNCTIONS                                  *
 ******************************************************************************/

export async function getAppVersion(
  packageName: string,
): Promise<string | null> {
  try {
    return await AppManager.getAppVersion(packageName);
  } catch (error) {
    Logger.error(
      'AppManager',
      'getAppVersion',
      `Failed to get version of ${packageName}`,
      error,
    );
  }
  return null;
}

export async function getInstalledApps(): Promise<AppInfo[]> {
  try {
    return await AppManager.getInstalledApps();
  } catch (error) {
    Logger.error(
      'AppManager',
      'getInstalledApps',
      'Failed to get installed apps',
      error,
    );
  }
  return [];
}

export async function uninstallApp(packageName: string): Promise<boolean> {
  try {
    return await AppManager.uninstallApp(packageName);
  } catch (error) {
    Logger.error(
      'AppManager',
      'uninstallApp',
      `Failed to uninstall ${packageName}`,
      error,
    );
  }
  return false;
}

export async function openApp(packageName: string): Promise<boolean> {
  try {
    return await AppManager.openApp(packageName);
  } catch (error) {
    Logger.error(
      'AppManager',
      'openApp',
      `Failed to open ${packageName}`,
      error,
    );
  }
  return false;
}

export async function installApk(
  apkPath: string,
): Promise<true | AppInstallError> {
  const filename = getFileName(apkPath);
  let catchedError: unknown;
  let returnError: AppInstallError = AppInstallError.UNKNOWN;
  try {
    const success = await AppManager.installApk(apkPath);
    if (success) {
      Logger.info('AppManager', 'installApp', `Installed ${filename}`);
      return true;
    }
  } catch (error) {
    catchedError = error;
    if (error instanceof Error) {
      if (error.message in AppInstallError) {
        returnError = error.message as AppInstallError;
      } else if (
        ['unknown sources', 'permission'].some(str =>
          error.message.toLowerCase().includes(str),
        )
      ) {
        returnError = AppInstallError.MISSING_PERMISSION;
      }
    }
  }
  Logger.error(
    'AppManager',
    'installApp',
    `Failed to install ${filename}`,
    catchedError,
  );
  return returnError;
}

export async function getApkInfo(apkPath: string): Promise<ApkInfo | null> {
  const filename = getFileName(apkPath);
  try {
    return await AppManager.getApkInfo(apkPath);
  } catch (error) {
    Logger.error(
      'AppManager',
      'getApkInfo',
      `Failed to get info of ${filename}`,
      error,
    );
  }
  return null;
}
