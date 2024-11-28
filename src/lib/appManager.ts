import {Logger} from '@/store/persistent/logs';
import {NativeModules} from 'react-native';
const {AppManager} = NativeModules;

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/
export interface InstalledApp {
  packageName: string;
  versionName: string;
  appName: string;
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

export async function getInstalledApps(): Promise<InstalledApp[]> {
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
  let filename: string;
  try {
    filename = decodeURIComponent(apkPath).split('/').pop() || '';
  } catch (e) {
    filename = apkPath.split('/').pop() || '';
  }
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
