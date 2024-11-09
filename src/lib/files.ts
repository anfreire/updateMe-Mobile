import ReactNativeBlobUtil, {
  FetchBlobResponse,
  ReactNativeBlobUtilStat,
  StatefulPromise,
} from 'react-native-blob-util';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const dir: string = ReactNativeBlobUtil.fs.dirs.DownloadDir;

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const buildFileName = (appName: string, version: string): string =>
  `${appName} ${version}.apk`;

const buildAbsolutePath = (fileName: string) => `${dir}/${fileName}`;

const isAbsolutePath = (path: string): boolean => path.startsWith(dir);

/******************************************************************************
 *                                 FUNCTIONS                                  *
 ******************************************************************************/

async function getFileInfo(path: string): Promise<ReactNativeBlobUtilStat> {
  return await ReactNativeBlobUtil.fs.stat(
    isAbsolutePath(path) ? path : buildAbsolutePath(path),
  );
}

async function listDir(): Promise<string[]> {
  return (await ReactNativeBlobUtil.fs.ls(dir)).filter(file =>
    file.endsWith('.apk'),
  );
}

async function getAllFilesInfo(): Promise<
  Record<string, ReactNativeBlobUtilStat>
> {
  const filesInfo: Record<string, ReactNativeBlobUtilStat> = {};

  const files = await listDir();
  for (const file of files) {
    filesInfo[file] = await getFileInfo(file);
  }

  return filesInfo;
}

async function installApk(path: string): Promise<boolean | null> {
  return await ReactNativeBlobUtil.android.actionViewIntent(
    isAbsolutePath(path) ? path : buildAbsolutePath(path),
    'application/vnd.android.package-archive',
  );
}

async function deleteFile(path: string): Promise<void> {
  await ReactNativeBlobUtil.fs.unlink(
    isAbsolutePath(path) ? path : buildAbsolutePath(path),
  );
}

async function deleteMultipleFiles(paths: string[]): Promise<number> {
  await Promise.all(paths.map(async path => await deleteFile(path)));
  return paths.length;
}

async function deleteAllFiles(): Promise<number> {
  return await deleteMultipleFiles(await listDir());
}

function downloadFile(
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
    .fetch('GET', url, {})
    .progress((received, total) =>
      onProgress(parseFloat(received) / parseFloat(total)),
    );
}

export default {
  buildAbsolutePath,
  getFileInfo,
  listDir,
  getAllFilesInfo,
  installApk,
  deleteFile,
  deleteMultipleFiles,
  deleteAllFiles,
  downloadFile,
  buildFileName,
};
