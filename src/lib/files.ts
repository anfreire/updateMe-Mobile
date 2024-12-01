import {Logger} from '@/stores/persistent/logs';
import ReactNativeBlobUtil, {
  FetchBlobResponse,
  ReactNativeBlobUtilStat,
} from 'react-native-blob-util';
import DocumentPicker from 'react-native-document-picker';
import Share from 'react-native-share';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

export const DOWNLOADS_DIR: string = ReactNativeBlobUtil.fs.dirs.DownloadDir;

export const APK_MIME_TYPE: string = 'application/vnd.android.package-archive';

export const APK_NAME_EXCLUDE_PATTERN = /[^a-zA-Z0-9]/g;

export const APK_VERSION_EXCLUDE_PATTERN = /[^a-zA-Z0-9.]/g;

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

export function buildFileName(appName: string, version: string): string {
  return (
    appName.replace(APK_NAME_EXCLUDE_PATTERN, '') +
    '_' +
    version.replace(APK_VERSION_EXCLUDE_PATTERN, '') +
    '.apk'
  );
}

export function makeAbsolutePath(path: string) {
  return path.startsWith(DOWNLOADS_DIR) ||
    path.startsWith('content://') ||
    path.startsWith('file://')
    ? path
    : `${DOWNLOADS_DIR}/${path}`;
}

export function getFileName(path: string): string {
  return path.split('/').pop() || '';
}

/******************************************************************************
 *                                 FUNCTIONS                                  *
 ******************************************************************************/

export async function fileExists(path: string): Promise<boolean> {
  return await ReactNativeBlobUtil.fs.exists(makeAbsolutePath(path));
}

export async function getFileInfo(
  path: string,
): Promise<ReactNativeBlobUtilStat> {
  return await ReactNativeBlobUtil.fs.stat(makeAbsolutePath(path));
}

export async function getFileHash(path: string): Promise<string> {
  return await ReactNativeBlobUtil.fs.hash(makeAbsolutePath(path), 'sha256');
}

export async function listDir(): Promise<string[]> {
  return (await ReactNativeBlobUtil.fs.ls(DOWNLOADS_DIR)).filter(file =>
    file.endsWith('.apk'),
  );
}

export async function deleteFile(path: string): Promise<void> {
  try {
    return await ReactNativeBlobUtil.fs.unlink(makeAbsolutePath(path));
  } catch {}
}

export async function downloadFile(
  url: string,
  fileName: string,
  path: string,
  onProgress: (progress: number) => void,
): Promise<FetchBlobResponse | null> {
  try {
    return await ReactNativeBlobUtil.config({
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: fileName,
        path,
        mediaScannable: true,
      },
    })
      .fetch('GET', url, {})
      .progress((received, total) =>
        onProgress(Number(received) / Number(total)),
      );
  } catch (err) {
    Logger.error(
      'FilesModule',
      'Download File',
      `Failed to download ${url}`,
      err,
    );
    return null;
  }
}

export async function uploadFile(
  url: string,
  path: string,
  headers: Record<string, string>,
  onProgress: (progress: number) => void,
): Promise<FetchBlobResponse | null> {
  try {
    return await ReactNativeBlobUtil.fetch('POST', url, headers, [
      {
        name: 'file',
        filename: getFileName(path),
        type: 'application/octet-stream',
        data: ReactNativeBlobUtil.wrap(makeAbsolutePath(path)),
      },
    ]).uploadProgress((written, total) => onProgress(written / total));
  } catch (err) {
    Logger.error('FilesModule', 'Upload File', `Failed to upload ${path}`, err);
    return null;
  }
}

export async function pickFile(
  onlyApkFiles: boolean = true,
): Promise<string | null> {
  try {
    const result = await DocumentPicker.pick({
      type: [onlyApkFiles ? APK_MIME_TYPE : DocumentPicker.types.allFiles],
    });
    return result[0].uri;
  } catch (err) {
    Logger.error('FilesModule', 'File Picker', 'Failed to pick a file', err);
    return null;
  }
}

export async function shareFiles(paths: string[]): Promise<void> {
  try {
    const result = await Share.open({
      urls: paths.map(path => 'file://' + makeAbsolutePath(path)),
    });
    if (result.dismissedAction) {
      Logger.debug('FilesModule', 'Share Files', 'Share action dismissed');
    } else if (!result.success) {
      Logger.error('FilesModule', 'Share Files', 'Failed to share files');
    }
  } catch (err) {
    Logger.error('FilesModule', 'Share Files', 'Failed to share files', err);
  }
}
