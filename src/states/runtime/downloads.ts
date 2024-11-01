import FilesModule from '../../lib/files';
import {create} from 'zustand';
import {FetchBlobResponse, StatefulPromise} from 'react-native-blob-util';
import {Logger} from '../persistent/logs';

export interface Download {
  progress: number;
  task?: StatefulPromise<FetchBlobResponse>;
}

type useDownloadsState = {
  hasDownloads: boolean;
  downloads: Record<string, Download>;
};

type useDownloadsActions = {
  addDownload: (
    fileName: string,
    url: string,
    onStart?: (fileName: string) => void,
    onProgress?: (progress: number) => void,
    onFinished?: (path: string) => void,
  ) => void;
  cancelDownload: (fileName: string) => void;
  removeDownload: (fileName: string) => void;
};

export type useDownloadsProps = useDownloadsState & useDownloadsActions;

export const useDownloads = create<useDownloadsProps>((set, get) => ({
  hasDownloads: false,
  downloads: {},
  addDownload: (
    fileName: string,
    url: string,
    onStart = () => {},
    onProgress = () => {},
    onFinished = () => {},
  ) => {
    set(state => ({
      hasDownloads: true,
      downloads: {
        ...state.downloads,
        [fileName]: {progress: 0},
      },
    }));

    const path = FilesModule.buildAbsolutePath(fileName);
    onStart(fileName);
    const task = FilesModule.downloadFile(url, fileName, path, progress => {
      set(state => ({
        downloads: {
          ...state.downloads,
          [fileName]: {
            ...state.downloads[fileName],
            progress,
          },
        },
      }));
      onProgress(progress);
    });

    set(state => ({
      downloads: {
        ...state.downloads,
        [fileName]: {...state.downloads[fileName], task},
      },
    }));

    task
      .then(result => {
        onFinished(result.path());
      })
      .catch(reason => {
        Logger.error(`Error downloading file ${fileName}: ${reason}`);
      })
      .finally(() => {
        get().removeDownload(fileName);
      });
  },
  removeDownload: (fileName: string) => {
    set(state => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[fileName]: _, ...restDownloads} = state.downloads;
      return {
        downloads: restDownloads,
        hasDownloads: Object.keys(restDownloads).length > 0,
      };
    });
  },
  cancelDownload: (fileName: string) => {
    const download = get().downloads[fileName];
    if (download?.task) {
      try {
        download.task.cancel();
      } catch (error) {
        Logger.error(`Error cancelling download ${fileName}: ${error}`);
      }
      get().removeDownload(fileName);
      FilesModule.deleteFile(fileName);
    }
  },
}));
