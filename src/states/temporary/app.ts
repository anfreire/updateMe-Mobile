import {create} from 'zustand';
import AppsModule from '@/lib/apps';

const APP_INFO_URL =
  'https://raw.githubusercontent.com/anfreire/updateMe-Data/main/app.json';

interface AppInfo {
  version: string;
  download: string;
  releaseNotes: {title: string; description: string}[];
}

export interface useAppProps {
  localVersion: string;
  info: AppInfo;
  getVersion: () => Promise<string>;
  fetchInfo: () => Promise<null | AppInfo>;
}

export const useApp = create<useAppProps>(set => ({
  localVersion: '',
  info: {
    version: '',
    download: '',
    releaseNotes: [],
  },
  getVersion: async () => {
    const version = await AppsModule.getAppVersion('com.updateme') as string;
    set({localVersion: version});
    return version;
  },
  fetchInfo: async () => {
    try {
      const response = await fetch(APP_INFO_URL);
      const info = await response.json();
      set({info});
      return info;
    } catch (error) {
      return null;
    }
  },
}));
