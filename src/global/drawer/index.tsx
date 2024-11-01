import * as React from 'react';
import {List} from 'react-native-paper';
import {Drawer} from 'react-native-drawer-layout';
import {useTheme} from '@/theme';
import Animated from 'react-native-reanimated';
import {useDrawer} from '@/states/runtime/drawer';
import {Dialog, useDialogs} from '@/states/runtime/dialogs';
import {useDownloads} from '@/states/runtime/downloads';
import {useTranslations} from '@/states/persistent/translations';
import {useNavigation} from '@react-navigation/native';
import {MainStackPage, NavigationProps} from '@/types/navigation';
import {usePulsingStyles} from '@/hooks/usePulsing';
import {
  ListRenderItem,
  FlatList,
  Linking,
  View,
  StyleSheet,
} from 'react-native';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';

const OPEN_NEW_ISSUE_URL =
  'https://github.com/anfreire/updateMe-Mobile/issues/new';

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

interface DrawerItem {
  key: string;
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  style?: {opacity: number};
}

const renderListIcon =
  (icon: string) => (props: {color: string; style: Style}) => (
    <View style={styles.iconWrapper}>
      <List.Icon {...props} icon={icon} />
    </View>
  );

interface DrawerWrapperProps {
  children: React.ReactNode;
}

const DrawerWrapper = ({children}: DrawerWrapperProps) => {
  const {schemedTheme} = useTheme();
  const {navigate} = useNavigation<NavigationProps>();
  const [isDrawerOpen, closeDrawer] = useDrawer(state => [
    state.isDrawerOpen,
    state.closeDrawer,
  ]);
  const hasDownloads = useDownloads(state => state.hasDownloads);
  const openDialog = useDialogs(state => state.openDialog);
  const translations = useTranslations(state => state.translations);

  const pulsingStyles = usePulsingStyles(hasDownloads && isDrawerOpen);

  const navigateTo = React.useCallback(
    (route: MainStackPage) => {
      closeDrawer();
      navigate(route);
    },
    [navigate],
  );

  const handleOpenDialog = React.useCallback((key: Dialog) => {
    closeDrawer();
    openDialog(key);
  }, []);

  const items: DrawerItem[] = React.useMemo(
    () => [
      {
        key: 'downloads',
        title: translations['Downloads'],
        description: translations['View your downloads'],
        icon: 'download',
        onClick: () => navigateTo('downloads'),
        style: pulsingStyles,
      },
      {
        key: 'updates',
        title: translations['Updates'],
        description: translations['Check for updates'],
        icon: 'update',
        onClick: () => navigateTo('updates'),
      },
      {
        key: 'tips',
        title: translations['Tips'],
        description: translations['Maximize your experience'],
        icon: 'star-four-points',
        onClick: () => navigateTo('tips-stack'),
      },
      {
        key: 'settings',
        title: translations['Settings'],
        description: translations['Change the app settings'],
        icon: 'cog',
        onClick: () => navigateTo('settings'),
      },
      {
        key: 'share',
        title: translations['Share'],
        description: translations['Share the app with friends'],
        icon: 'share-variant',
        onClick: () => handleOpenDialog('share'),
      },
      {
        key: 'report',
        title: translations['Report'],
        description: translations['Report a problem with the app'],
        icon: 'bug',
        onClick: () => Linking.openURL(OPEN_NEW_ISSUE_URL),
      },
    ],
    [navigateTo, handleOpenDialog, translations],
  );

  const renderDrawerItem: ListRenderItem<DrawerItem> = React.useCallback(
    ({item}) => (
      <AnimatedListItem
        title={item.title}
        description={item.description}
        left={renderListIcon(item.icon)}
        onPress={item.onClick}
        style={item.style}
      />
    ),
    [],
  );

  const renderDrawerContent = React.useCallback(() => {
    return (
      <List.Section>
        <FlatList
          data={items}
          renderItem={renderDrawerItem}
          keyExtractor={(item: DrawerItem) => item.key}
        />
      </List.Section>
    );
  }, [items, renderDrawerItem]);

  return (
    <Drawer
      open={isDrawerOpen}
      onOpen={() => {}}
      onClose={closeDrawer}
      drawerPosition="right"
      swipeEnabled={false}
      drawerStyle={{
        backgroundColor: schemedTheme.surfaceContainer,
      }}
      renderDrawerContent={renderDrawerContent}>
      {children}
    </Drawer>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DrawerWrapper;
