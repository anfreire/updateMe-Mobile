import FilesModule from "../../lib/files";
import { create } from "zustand";
import { useSettings } from "../persistent/settings";
import ReactNativeBlobUtil, {
	FetchBlobResponse,
	StatefulPromise,
} from "react-native-blob-util";
import { Logger } from "../persistent/logs";

type DownloadStatus = "pending" | "downloading" | "completed" | "error";

interface Download {
	progress: number;
	status: DownloadStatus;
	task?: StatefulPromise<FetchBlobResponse>;
}

export interface UseDownloadsStore {
	downloads: Record<string, Download>;
	addDownload: (
		fileName: string,
		url: string,
		onProgress?: (progress: number) => void,
		onFinished?: (path: string) => void,
	) => Promise<void>;
	removeDownload: (fileName: string) => void;
	cancelDownload: (fileName: string) => void;
}

export const useDownloads = create<UseDownloadsStore>((set, get) => ({
	downloads: {},
	addDownload: async (
		fileName: string,
		url: string,
		onProgress = (_: number) => {},
		onFinished = (_: string) => {},
	) => {
		const path = FilesModule.correctPath(fileName);

		set((state) => ({
			downloads: {
				...state.downloads,
				[fileName]: { progress: 0, status: "pending" },
			},
		}));

		try {
			await ReactNativeBlobUtil.fs.unlink(path).catch(() => {});

			const task = ReactNativeBlobUtil.config({
				addAndroidDownloads: {
					useDownloadManager: true,
					notification: true,
					title: fileName,
					path,
					mediaScannable: true,
				},
			})
				.fetch("GET", url, {})
				.progress((received, total) => {
					const progress = parseFloat(received) / parseFloat(total);
					set((state) => ({
						downloads: {
							...state.downloads,
							[fileName]: {
								...state.downloads[fileName],
								progress,
								status: "downloading",
							},
						},
					}));
					onProgress(progress);
				});

			set((state) => ({
				downloads: {
					...state.downloads,
					[fileName]: { ...state.downloads[fileName], task },
				},
			}));

			const result = await task;
			get().removeDownload(fileName);
			onFinished(result.path());

			if (
				useSettings.getState().settings.downloads.installAfterDownload
			) {
				await FilesModule.installApk(result.path());
			}

			set((state) => ({
				downloads: {
					...state.downloads,
					[fileName]: {
						...state.downloads[fileName],
						status: "completed",
					},
				},
			}));
		} catch (error) {
			Logger.error(`Error downloading file ${fileName}: ${error}`);
			set((state) => ({
				downloads: {
					...state.downloads,
					[fileName]: {
						...state.downloads[fileName],
						status: "error",
					},
				},
			}));
		}
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
