import {Logger} from '@/states/persistent/logs';
import ReactNativeBlobUtil, {
  FetchBlobResponse,
  ReactNativeBlobUtilStat,
  StatefulPromise,
} from 'react-native-blob-util';
import DocumentPicker from 'react-native-document-picker';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const DIR: string = ReactNativeBlobUtil.fs.dirs.DownloadDir;
const APK_MIME_TYPE: string = 'application/vnd.android.package-archive';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const buildFileName = (appName: string, version: string): string =>
  `${appName} ${version}.apk`;

const buildAbsolutePath = (fileName: string) => `${DIR}/${fileName}`;

const isAbsolutePath = (path: string): boolean => path.startsWith(DIR);

/******************************************************************************
 *                                 FUNCTIONS                                  *
 ******************************************************************************/

async function getFileInfo(path: string): Promise<ReactNativeBlobUtilStat> {
  return await ReactNativeBlobUtil.fs.stat(
    isAbsolutePath(path) ? path : buildAbsolutePath(path),
  );
}

async function listDir(): Promise<string[]> {
  return (await ReactNativeBlobUtil.fs.ls(DIR)).filter(file =>
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
    APK_MIME_TYPE,
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

async function pickExternalFile(): Promise<string | null> {
  try {
    const result = await DocumentPicker.pick({
      type: [
        APK_MIME_TYPE,
        // DocumentPicker.types.allFiles
      ],
    });
    return result[0].uri;
  } catch (err) {
    Logger.error('FilesModule', 'File Picker', 'Failed to pick a file', err);
    return null;
  }
}

function hashFile(path: string): Promise<string> {
  return ReactNativeBlobUtil.fs.hash(path, 'sha256');
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
  pickExternalFile,
  hashFile,
};
