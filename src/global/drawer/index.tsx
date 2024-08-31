import * as React from "react";
import { List } from "react-native-paper";
import { Drawer } from "react-native-drawer-layout";
import { useTheme } from "@/theme";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useDrawer } from "@/states/temporary/drawer";
import { CustomDialogsType, useDialogs } from "@/states/temporary/dialogs";
import { useDownloads } from "@/states/temporary/downloads";
import { useNavigate } from "@/hooks/navigation";
import { Page } from "@/states/temporary/session";
import { useTranslations } from "@/states/persistent/translations";

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

interface DrawerItem {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

export default function DrawerWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isDrawerOpen, closeDrawer] = useDrawer((state) => [
    state.isDrawerOpen,
    state.closeDrawer,
  ]);
  const downloads = useDownloads((state) => state.downloads);
  const openDialog = useDialogs((state) => state.openDialog);
  const translations = useTranslations((state) => state.translations);

  const opacity = useSharedValue(1);

  const animationStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const pulse = React.useCallback(() => {
    opacity.value = withRepeat(
      withTiming(0.5, {
        duration: 600,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );
  }, []);

  const stopPulsing = React.useCallback(() => {
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const navigateTo = React.useCallback(
    (route: Page) => {
      closeDrawer();
      navigate(route);
    },
    [navigate]
  );

  const handleOpenDialog = React.useCallback(
    (key: CustomDialogsType) => {
      closeDrawer();
      openDialog(key);
    },
    [openDialog]
  );

  React.useEffect(() => {
    if (isDrawerOpen && Object.keys(downloads).length > 0) {
      pulse();
      const timer = setTimeout(stopPulsing, 2500);
      return () => clearTimeout(timer);
    } else {
      stopPulsing();
    }
  }, [isDrawerOpen, downloads, pulse, stopPulsing]);

  const items: Record<string, DrawerItem> = React.useMemo(
    () => ({
      downloads: {
        title: translations["Downloads"],
        description: translations["View your downloads"],
        icon: "download",
        onClick: () => navigateTo("downloads"),
      },
      updates: {
        title: translations["Updates"],
        description: translations["Check for updates"],
        icon: "update",
        onClick: () => navigateTo("updates"),
      },
      tips: {
        title: translations["Tips"],
        description: translations["Maximize your experience"],
        icon: "star-four-points",
        onClick: () => navigateTo("tips"),
      },
      settings: {
        title: translations["Settings"],
        description: translations["Change the app settings"],
        icon: "cog",
        onClick: () => navigateTo("settings"),
      },
      suggest: {
        title: translations["Suggest"],
        description: translations["Suggest a new app"],
        icon: "lightbulb-on",
        onClick: () => navigateTo("suggest"),
      },
      share: {
        title: translations["Share"],
        description: translations["Share the app with friends"],
        icon: "share-variant",
        onClick: () => handleOpenDialog("share"),
      },
      report: {
        title: translations["Report"],
        description: translations["Report a problem with the app"],
        icon: "bug",
        onClick: () => navigateTo("report"),
      },
    }),
    [navigateTo, handleOpenDialog, translations]
  );

  const renderDrawerContent = React.useCallback(
    () => (
      <List.Section>
        {Object.entries(items).map(([key, item]) =>
          key === "downloads" ? (
            <AnimatedListItem
              key={key}
              title={item.title}
              description={item.description}
              style={animationStyle}
              left={(props) => <List.Icon {...props} icon={item.icon} />}
              onPress={item.onClick}
            />
          ) : (
            <List.Item
              key={key}
              title={item.title}
              description={item.description}
              left={(props) => <List.Icon {...props} icon={item.icon} />}
              onPress={item.onClick}
            />
          )
        )}
      </List.Section>
    ),
    [items, animationStyle]
  );

  return (
    <Drawer
      open={isDrawerOpen}
      onOpen={() => {}}
      onClose={closeDrawer}
      drawerPosition="right"
      swipeEnabled={false}
      drawerStyle={{
        backgroundColor: theme.schemedTheme.surfaceContainer,
      }}
      renderDrawerContent={renderDrawerContent}
    >
      {children}
    </Drawer>
  );
}
