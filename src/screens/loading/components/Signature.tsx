import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const Signature = () => {
  return (
    <View className="absolute bottom-0 p-4 flex flex-col justify-center items-center opacity-40">
      <Text className="text-primary" style={styles.font}>
        Developed by anfreire
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
