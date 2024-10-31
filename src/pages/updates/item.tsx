import * as React from 'react';
import {Image, View, StyleSheet} from 'react-native';
import {Button, List, Text} from 'react-native-paper';
import {interpolate, useTranslations} from '@/states/persistent/translations';
import {useDownloads} from '@/states/runtime/downloads';
import {useToast} from '@/states/runtime/toast';
import {useTheme} from '@/theme';
import {useIndex} from '@/states/fetched';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '@/types/navigation';

const AppIcon = (uri?: string) => (
  <View style={styles.iconContainer}>
    <Image style={styles.icon} source={{uri}} resizeMode="contain" />
  </View>
);

export function useUpdateItemCallbacks(updateApp: (appName: string) => void) {
  const translations = useTranslations(state => state.translations);
  const index = useIndex(state => state.index);
  const downloads = useDownloads(state => state.downloads);
  const theme = useTheme();
  const openToast = useToast(state => state.openToast);
  const {navigate} = useNavigation<NavigationProps>();

  const handlePress = React.useCallback(
    (appName: string) => {
      openToast(
        interpolate(translations['Long press to enter $1 page'], appName),
      );
    },
    [translations],
  );

  const handleLongPress = React.useCallback(
    (appName: string) => {
      navigate('app', {app: appName});
    },
    [navigate],
  );

  const buildLeftItem = React.useCallback(
    (appName: string) => AppIcon(index[appName].icon),
    [index],
  );

  const buildRightItem = React.useCallback(
    (appName: string, fileName: string | null) => (
      <View style={styles.rightContainer}>
        {fileName ? (
          <Text
            style={[
              styles.progressText,
              {color: theme.schemedTheme.secondary},
            ]}>
            {`${(downloads[fileName].progress * 100).toFixed(0)}%`}
          </Text>
        ) : (
          <Button mode="contained-tonal" onPress={() => updateApp(appName)}>
            {translations['Update']}
          </Button>
        )}
      </View>
    ),
    [downloads, translations, theme.schemedTheme.secondary, updateApp],
  );

  return {handlePress, handleLongPress, buildLeftItem, buildRightItem};
}

interface UpdateItemProps {
  appName: string;
  fileName: string | null;
  updateApp: (appName: string) => void;
  handlePress: (appName: string) => void;
  handleLongPress: (appName: string) => void;
  buildLeftItem: (appName: string) => JSX.Element;
  buildRightItem: (appName: string, fileName: string | null) => JSX.Element;
}

const UpdateItem = ({
  appName,
  fileName,
  handlePress,
  handleLongPress,
  buildLeftItem,
  buildRightItem,
}: UpdateItemProps) => (
  <List.Item
    title={appName}
    titleStyle={styles.title}
    left={buildLeftItem.bind(null, appName)}
    right={buildRightItem.bind(null, appName, fileName)}
    onPress={handlePress.bind(null, appName)}
    onLongPress={handleLongPress.bind(null, appName)}
  />
);

const styles = StyleSheet.create({
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

export default UpdateItem;
