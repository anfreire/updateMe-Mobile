import ReactNativeBlobUtil, {
	FetchBlobResponse,
	ReactNativeBlobUtilStat,
	StatefulPromise,
} from "react-native-blob-util";

namespace FilesModule {
	export const dir: string = ReactNativeBlobUtil.fs.dirs.DownloadDir;

	export function buildAbsolutePath(fileName: string): string {
		return `${dir}/${fileName}`;
	}

	//----------------------------------------------------------------------------
	// FUNCTIONS
	export async function getFileInfo(
		path: string,
	): Promise<ReactNativeBlobUtilStat> {
		return await ReactNativeBlobUtil.fs.stat(path);
	}

	export async function listDir(): Promise<string[]> {
		return (await ReactNativeBlobUtil.fs.ls(dir)).filter((file) =>
			file.endsWith(".apk"),
		);
	}

	export async function getAllFilesInfo(): Promise<
		Record<string, ReactNativeBlobUtilStat>
	> {
		const files = await listDir();
		return await files.reduce(async (accPromise, file) => {
			const acc = await accPromise;
			const fileInfo = await getFileInfo(file);
			return { ...acc, [file]: fileInfo };
		}, Promise.resolve({}));
	}

	export async function installApk(path: string): Promise<void> {
		await ReactNativeBlobUtil.android.actionViewIntent(
			path,
			"application/vnd.android.package-archive",
		);
	}

	export async function deleteFile(path: string): Promise<void> {
		await ReactNativeBlobUtil.fs.unlink(path);
	}

	export async function deleteMultipleFiles(paths: string[]): Promise<void> {
		await Promise.all(paths.map(async (path) => await deleteFile(path)));
	}

	export async function deleteAllFiles(): Promise<void> {
		await deleteMultipleFiles(await listDir());
	}

	export function downloadFile(
		url: string,
		filename: string,
		path: string,
		onProgress: (progress: number) => void,
	): StatefulPromise<FetchBlobResponse> {
		return ReactNativeBlobUtil.config({
			addAndroidDownloads: {
				useDownloadManager: true,
				notification: true,
				title: filename,
				path,
				mediaScannable: true,
			},
		})
			.fetch("GET", url, {})
			.progress((received, total) =>
				onProgress(parseFloat(received) / parseFloat(total)),
			);
	}
}

export default FilesModule;
