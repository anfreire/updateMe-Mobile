import {Logger} from '@/store/persistent/logs';
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

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function getFileName(path: string): string {
  try {
    return decodeURIComponent(path).split('/').pop() || '';
  } catch (e) {
    return path.split('/').pop() || '';
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

export async function installApk(apkPath: string): Promise<boolean> {
  const filename = getFileName(apkPath);
  try {
    const success = await AppManager.installApk(apkPath);
    if (success) {
      Logger.info('AppManager', 'installApp', `Installed ${filename}`);
      return true;
    }
    Logger.error('AppManager', 'installApp', `Failed to install ${filename}`);
  } catch (error) {
    Logger.error(
      'AppManager',
      'installApp',
      `Failed to install ${filename}`,
      error,
    );
  }
  return false;
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
