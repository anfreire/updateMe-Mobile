import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {UpdatesListCommonProps, UpdatesListItemData} from './UpdatesList';
import {IndexAppProviderProps} from '@/states/fetched';
import {Button, List, Text} from 'react-native-paper';
import Image from 'react-native-fast-image';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

const LeftItem = ({uri}: {uri: string}) => (
  <View style={styles.iconContainer}>
    <Image style={styles.icon} source={{uri}} resizeMode="contain" />
  </View>
);

const RightItem = ({
  updateLabel,
  updateApp,
  appName,
  providerProps,
  progress,
}: {
  updateLabel: string;
  updateApp: (appName: string, providerProps: IndexAppProviderProps) => void;
  appName: string;
  providerProps: IndexAppProviderProps;
  progress?: number;
}) => (
  <View style={styles.rightContainer}>
    {progress ? (
      <Text style={styles.progressText}>
        {`${(progress * 100).toFixed(0)}%`}
      </Text>
    ) : (
      <Button
        mode="contained-tonal"
        onPress={() => updateApp(appName, providerProps)}>
        {updateLabel}
      </Button>
    )}
  </View>
);

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface UpdatesListItemProps
  extends UpdatesListItemData,
    UpdatesListCommonProps {
  updateApp: (appName: string, providerProps: IndexAppProviderProps) => void;
}

const UpdatesListItem = ({
  title,
  provider,
  icon,
  download,
  onPress,
  onLongPress,
  updateApp,
  updateLabel,
}: UpdatesListItemProps) => {
  return (
    <List.Item
      title={title}
      style={styles.item}
      titleStyle={styles.title}
      titleNumberOfLines={1}
      left={LeftItem.bind(null, {uri: icon})}
      right={RightItem.bind(null, {
        updateLabel,
        updateApp,
        appName: title,
        providerProps: provider,
        progress: download?.progress,
      })}
      onPress={onPress.bind(null, title)}
      onLongPress={onLongPress.bind(null, title)}
    />
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  item: {
    paddingRight: 10,
  },
  title: {
    fontSize: 18,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
    width: 100,
    minHeight: 40,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(UpdatesListItem);
