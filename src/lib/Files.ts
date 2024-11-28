import ReactNativeBlobUtil, {
  FetchBlobResponse,
  ReactNativeBlobUtilStat,
} from 'react-native-blob-util';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

export const DOWNLOADS_DIR: string = ReactNativeBlobUtil.fs.dirs.DownloadDir;

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
  return path.startsWith(DOWNLOADS_DIR) ? path : `${DOWNLOADS_DIR}/${path}`;
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
  return await ReactNativeBlobUtil.fs.unlink(makeAbsolutePath(path));
}

export async function downloadFile(
  url: string,
  fileName: string,
  path: string,
  onProgress: (progress: number) => void,
): Promise<FetchBlobResponse> {
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
}

export async function uploadFile(
  url: string,
  path: string,
  headers: Record<string, string>,
  onProgress: (progress: number) => void,
): Promise<FetchBlobResponse> {
  return await ReactNativeBlobUtil.fetch('POST', url, headers, [
    {
      name: 'file',
      filename: getFileName(path),
      type: 'application/octet-stream',
      data: ReactNativeBlobUtil.wrap(makeAbsolutePath(path)),
    },
  ]).uploadProgress((written, total) => onProgress(written / total));
}

export async function installApk(path: string): Promise<boolean | null> {
  return await ReactNativeBlobUtil.android.actionViewIntent(
    makeAbsolutePath(path),
    'application/vnd.android.package-archive',
  );
}
