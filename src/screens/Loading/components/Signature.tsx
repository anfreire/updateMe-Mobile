import {interpolate, useTranslations} from '@/stores/persistent/translations';
import {useTheme} from '@/theme';
import React, {memo, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const DEVELOPER_NAME = 'anfreire';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Signature = () => {
  const translations = useTranslations(state => state.translations);
  const {schemedTheme} = useTheme();

  const label = useMemo(
    () => interpolate(translations['Developed by $1'], DEVELOPER_NAME),
    [translations],
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.font, {color: schemedTheme.primary}]}>{label}</Text>
    </View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
  },
  font: {
    fontFamily: 'JetBrains Mono',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(Signature);
