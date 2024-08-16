import FilesModule from "../../lib/files";
import { create } from "zustand";
import { useSettings } from "../persistent/settings";
import ReactNativeBlobUtil, {
	FetchBlobResponse,
	StatefulPromise,
} from "react-native-blob-util";
import { Logger } from "../persistent/logs";

interface Download {
	progress: number;
	task?: StatefulPromise<FetchBlobResponse>;
}

export interface UseDownloadsStore {
	downloads: Record<string, Download>;
	addDownload: (
		fileName: string,
		url: string,
		onProgress?: (progress: number) => void,
		onFinished?: (path: string) => void,
	) => void;
	cancelDownload: (fileName: string) => void;
	removeDownload: (fileName: string) => void;
}

export const useDownloads = create<UseDownloadsStore>((set, get) => ({
	downloads: {},
	addDownload: (
		fileName: string,
		url: string,
		onProgress = (_: number) => {},
		onFinished = (_: string) => {},
	) => {
		set((state) => ({
			downloads: {
				...state.downloads,
				[fileName]: { progress: 0 },
			},
		}));

		const path = FilesModule.buildFullPath(fileName);
		const task = FilesModule.downloadFile(
			url,
			fileName,
			path,
			(progress) => {
				set((state) => ({
					downloads: {
						...state.downloads,
						[fileName]: {
							...state.downloads[fileName],
							progress,
						},
					},
				}));
				onProgress(progress);
			},
		);

		set((state) => ({
			downloads: {
				...state.downloads,
				[fileName]: { ...state.downloads[fileName], task },
			},
		}));

		task.then((result) => {
			get().removeDownload(fileName);
			onFinished(result.path());
		}).catch((reason) => {
			Logger.error(`Error downloading file ${fileName}: ${reason}`);
			get().removeDownload(fileName);
		});
	},
	removeDownload: (fileName: string) => {
		set((state) => {
			const { [fileName]: _, ...restDownloads } = state.downloads;
			return { downloads: restDownloads };
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
