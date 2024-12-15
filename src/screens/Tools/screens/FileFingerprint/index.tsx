import React, {memo, useCallback, useMemo, useState} from 'react';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';
import {Page} from '@/navigation/types';
import {StyleSheet} from 'react-native';
import Animated, {LinearTransition} from 'react-native-reanimated';
import {Button, IconButton, Text, TextInput} from 'react-native-paper';
import {useTranslations} from '@/stores/persistent/translations';
import {getFileHash, pickFile} from '@/lib/files';
import {useToast} from '@/stores/runtime/toast';
import FilePicker from './components/FilePicker';

const AnimatedButton = Animated.createAnimatedComponent(Button);

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'fileFingerprint';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type FingerprintProps = {
  file: string | null;
  hash: string;
};

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const FileFingerprintScreen = () => {
  const translations = useTranslations(state => state.translations);
  const [fingerprint1, setFingerprint1] = useState<FingerprintProps | null>(
    null,
  );
  const [fingerprint2, setFingerprint2] = useState<FingerprintProps | null>(
    null,
  );

  useCurrPageEffect(CURR_PAGE);

  return (
    <Animated.View
      style={styles.container}
      layout={LinearTransition.delay(300).springify()}>
      <FilePicker setFingerprint={setFingerprint1} />
    </Animated.View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(FileFingerprintScreen);
