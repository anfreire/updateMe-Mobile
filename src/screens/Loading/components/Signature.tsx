import {interpolate, useTranslations} from '@/stores/persistent/translations';
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

  const label = useMemo(
    () => interpolate(translations['Developed by $1'], DEVELOPER_NAME),
    [translations],
  );

  return (
    <View className="absolute bottom-0 p-4 flex flex-col justify-center items-center opacity-40">
      <Text className="text-primary" style={styles.font}>
        {label}
      </Text>
    </View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  font: {
    fontFamily: 'JetBrains Mono',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(Signature);
