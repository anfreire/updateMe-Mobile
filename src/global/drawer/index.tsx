import {List} from 'react-native-paper';
import {Drawer} from 'react-native-drawer-layout';
import {useTheme} from '@/theme';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {useEffect} from 'react';
import {useDrawer} from '@/states/temporary/drawer';
import {CustomDialogsType, useDialogs} from '@/states/temporary/dialogs';
import {useDownloads} from '@/states/temporary/downloads';

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

export default function DrawerWrapper({children}: {children: React.ReactNode}) {
  const theme = useTheme();
  const navigate = useNavigation().navigate;
  const {isDrawerOpen, closeDrawer} = useDrawer(state => ({
    isDrawerOpen: state.isDrawerOpen,
    closeDrawer: state.closeDrawer,
  }));
  const downloads = useDownloads(state => state.downloads);
  const _openDialog = useDialogs().openDialog;

  const opacity = useSharedValue(1);

  const animationStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const pulse = () => {
    opacity.value = withRepeat(
      withTiming(0.5, {duration: 600, easing: Easing.inOut(Easing.quad)}),
      -1,
      true,
    );
  };

  const stopPulsing = () => {
    opacity.value = 1;
  };

  const navigateTo = (route: string) => {
    closeDrawer();
    navigate(route as never);
  };

  const openDialog = (key: CustomDialogsType) => {
    closeDrawer();
    _openDialog(key);
  };

  useEffect(() => {
    if (isDrawerOpen && Object.keys(downloads).length > 0) {
      pulse();
      setTimeout(() => {
        stopPulsing();
      }, 2500);
    } else {
      stopPulsing();
    }
  }, [isDrawerOpen, downloads]);

  const items: Record<
    string,
    {
      title: string;
      description: string;
      icon: string;
      onClick: () => void;
    }
  > = {
    downloads: {
      title: 'Downloads',
      description: 'View your downloads',
      icon: 'download',
      onClick: () => navigateTo('Downloads'),
    },
    updates: {
      title: 'Updates',
      description: 'Check for updates',
      icon: 'update',
      onClick: () => navigateTo('Updates'),
    },
    tips: {
      title: 'Tips',
      description: 'Maximize your experience',
      icon: 'star-four-points',
      onClick: () => navigateTo('Tips'),
    },
    settings: {
      title: 'Settings',
      description: 'Change the app settings',
      icon: 'cog',
      onClick: () => navigateTo('Settings'),
    },
    suggest: {
      title: 'Suggest',
      description: 'Suggest a new app',
      icon: 'lightbulb-on',
      onClick: () => navigateTo('Suggest'),
    },
    share: {
      title: 'Share',
      description: 'Share the app with friends',
      icon: 'share-variant',
      onClick: () => openDialog('share'),
    },
    report: {
      title: 'Report',
      description: 'Report a problem with the app',
      icon: 'bug',
      onClick: () => navigateTo('Report'),
    },
  };
  return (
    <Drawer
      open={isDrawerOpen}
      onOpen={() => {}}
      onClose={() => {
        isDrawerOpen && closeDrawer();
      }}
      drawerPosition={'right'}
      swipeEnabled={false}
      drawerStyle={{
        backgroundColor: theme.schemedTheme.surfaceContainer,
      }}
      renderDrawerContent={() => (
        <List.Section>
          {Object.keys(items).map(key =>
            items[key].title === 'Downloads' ? (
              <AnimatedListItem
                key={key}
                title={items[key].title}
                description={items[key].description}
                style={animationStyle}
                left={props => <List.Icon {...props} icon={items[key].icon} />}
                onPress={items[key].onClick}
              />
            ) : (
              <List.Item
                key={key}
                title={items[key].title}
                description={items[key].description}
                left={props => <List.Icon {...props} icon={items[key].icon} />}
                onPress={items[key].onClick}
              />
            ),
          )}
        </List.Section>
      )}>
      {children}
    </Drawer>
  );
}
