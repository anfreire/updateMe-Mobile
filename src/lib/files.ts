import ReactNativeBlobUtil, {
  FetchBlobResponse,
  ReactNativeBlobUtilStat,
  StatefulPromise,
} from 'react-native-blob-util';

const dir: string = ReactNativeBlobUtil.fs.dirs.DownloadDir;

const buildFileName = (appName: string, version: string): string =>
  `${appName} ${version}.apk`;

function buildAbsolutePath(fileName: string): string {
  return `${dir}/${fileName}`;
}

//----------------------------------------------------------------------------
// FUNCTIONS
async function getFileInfo(path: string): Promise<ReactNativeBlobUtilStat> {
  return await ReactNativeBlobUtil.fs.stat(path);
}

async function listDir(): Promise<string[]> {
  return (await ReactNativeBlobUtil.fs.ls(dir)).filter(file =>
    file.endsWith('.apk'),
  );
}

async function getAllFilesInfo(): Promise<
  Record<string, ReactNativeBlobUtilStat>
> {
  const files = await listDir();
  return await files.reduce(async (accPromise, file) => {
    const acc = await accPromise;
    const fileInfo = await ReactNativeBlobUtil.fs.stat(buildAbsolutePath(file));
    return {...acc, [file]: fileInfo};
  }, Promise.resolve({}));
}

async function installApk(path: string): Promise<boolean | null> {
  return await ReactNativeBlobUtil.android.actionViewIntent(
    path,
    'application/vnd.android.package-archive',
  );
}

async function deleteFile(path: string): Promise<void> {
  await ReactNativeBlobUtil.fs.unlink(path);
}

async function deleteMultipleFiles(paths: string[]): Promise<void> {
  await Promise.all(paths.map(async path => await deleteFile(path)));
}

async function deleteAllFiles(): Promise<void> {
  await deleteMultipleFiles(await listDir());
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
