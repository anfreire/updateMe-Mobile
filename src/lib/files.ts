import ReactNativeBlobUtil, {
  ReactNativeBlobUtilStat,
} from 'react-native-blob-util';

namespace FilesModule {
  //----------------------------------------------------------------------------
  // CONSTANTS
  export const dir: string = ReactNativeBlobUtil.fs.dirs.DownloadDir;

  //---------------------------------------------------------------------------
  // HELPERS
  export function correctPath(path: string): string {
    return path.startsWith(dir) ? path : `${dir}/${path}`;
  }

  //----------------------------------------------------------------------------
  // FUNCTIONS
  export async function getFileInfo(
    filename: string,
  ): Promise<ReactNativeBlobUtilStat> {
    return await ReactNativeBlobUtil.fs.stat(correctPath(filename));
  }

  export async function listDir(): Promise<string[]> {
    return (await ReactNativeBlobUtil.fs.ls(dir)).filter(file =>
      file.endsWith('.apk'),
    );
  }

  export async function getAllFilesInfo(): Promise<
    Record<string, ReactNativeBlobUtilStat>
  > {
    const files = await listDir();
    return await files.reduce(async (accPromise, file) => {
      const acc = await accPromise;
      const fileInfo = await getFileInfo(file);
      return {...acc, [file]: fileInfo};
    }, Promise.resolve({}));
  }

  export async function installApk(path: string): Promise<void> {
    await ReactNativeBlobUtil.android.actionViewIntent(
      correctPath(path),
      'application/vnd.android.package-archive',
    );
  }

  export async function deleteFile(fileName: string): Promise<void> {
    await ReactNativeBlobUtil.fs.unlink(correctPath(fileName));
  }

  export async function deleteMultipleFiles(
    fileNames: string[],
  ): Promise<void> {
    await Promise.all(
      fileNames.map(async fileName => await deleteFile(correctPath(fileName))),
    );
  }

  export async function deleteAllFiles(): Promise<void> {
    await deleteMultipleFiles(await listDir());
  }
}

export default FilesModule;
