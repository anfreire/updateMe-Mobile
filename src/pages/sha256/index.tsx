import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-share';
import FilesModule from '@/lib/files';
/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const pickAndHandleFile = async () => {
  FilesModule.pickExternalFile().then(async file => {
    if (file) {
      console.log('File:', file);
      FilesModule.hashFile(file).then(hash => {
        console.log('Hash:', hash);
      });
    }
  });
};

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

const useSha256Screen = () => {
  return {};
};

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface Sha256ScreenProps {}

const Sha256Screen = ({}: Sha256ScreenProps) => {
  const {} = useSha256Screen();

  return (
    <>
      <Button onPress={pickAndHandleFile}>Pick</Button>
    </>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default Sha256Screen;
// export default React.memo(Sha256Screen);
