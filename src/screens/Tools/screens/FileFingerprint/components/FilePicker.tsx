import React, {memo, useCallback} from 'react';
import {FingerprintProps} from '..';
import {useTranslations} from '@/stores/persistent/translations';
import {Button, Surface} from 'react-native-paper';
import {useToast} from '@/stores/runtime/toast';
import {getFileHash, pickFile} from '@/lib/files';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface FilePickerProps {
  setFingerprint: React.Dispatch<React.SetStateAction<FingerprintProps | null>>;
}

const FilePicker = ({setFingerprint}: FilePickerProps) => {
  const openToast = useToast(state => state.openToast);
  const translations = useTranslations(state => state.translations);

  const onPress = useCallback(async () => {
    const filePath = await pickFile();
    if (!filePath) {
      openToast(translations['No file selected']);
      return;
    }
    const fileHash = await getFileHash(filePath);
    if (!fileHash) {
      openToast(translations['Failed to calculate file hash'], {type: 'error'});
      return;
    }
    setFingerprint({file: filePath, hash: fileHash});
  }, [translations, setFingerprint]);

  return (
    <Surface>
      <Button mode="contained" icon="file" onPress={onPress}>
        {translations['Pick a file']}
      </Button>
    </Surface>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(FilePicker);
