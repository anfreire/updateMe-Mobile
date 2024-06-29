import {NativeModules} from 'react-native';

namespace AppsModule {
  export function getAllApps(): Promise<string[]> {
    return NativeModules.AppsModule.getAllApps();
  }

  export function getAppVersion(packageName: string): Promise<string | null> {
    return NativeModules.AppsModule.getAppVersion(packageName);
  }

  export function isAppInstalled(packageName: string): Promise<boolean> {
    return NativeModules.AppsModule.isAppInstalled(packageName);
  }

  export function openApp(packageName: string): void {
    NativeModules.AppsModule.openApp(packageName);
  }

  export function uninstallApp(packageName: string): void {
    NativeModules.AppsModule.uninstallApp(packageName);
  }
}

export default AppsModule;
