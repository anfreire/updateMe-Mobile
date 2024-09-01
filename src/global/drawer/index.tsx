import * as React from "react";
import { List } from "react-native-paper";
import { Drawer } from "react-native-drawer-layout";
import { useTheme } from "@/theme";
import Animated from "react-native-reanimated";
import { useDrawer } from "@/states/runtime/drawer";
import { Dialog, useDialogs } from "@/states/runtime/dialogs";
import { useDownloads } from "@/states/runtime/downloads";
import { useTranslations } from "@/states/persistent/translations";
import { useNavigate } from "@/hooks/useNavigate";
import { usePulsing } from "@/hooks/usePulsing";
import { ListRenderItem, FlatList } from "react-native";
import { Page } from "@/types/navigation";

const AnimatedListItem = Animated.createAnimatedComponent(List.Item);

interface DrawerItem {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

interface DrawerWrapperProps {
  children: React.ReactNode;
}

const DrawerWrapper = ({ children }: DrawerWrapperProps) => {
  const { schemedTheme } = useTheme();
  const navigate = useNavigate();
  const [isDrawerOpen, closeDrawer] = useDrawer((state) => [
    state.isDrawerOpen,
    state.closeDrawer,
  ]);
  const downloads = useDownloads((state) => state.downloads);
  const openDialog = useDialogs((state) => state.openDialog);
  const translations = useTranslations((state) => state.translations);

  const pulseSettings = React.useMemo(
    () => isDrawerOpen && Object.keys(downloads).length > 0,
    [isDrawerOpen, downloads]
  );

  const puslingStyles = usePulsing(pulseSettings);

  const navigateTo = React.useCallback(
    (route: Page) => {
      closeDrawer();
      navigate(route);
    },
    [navigate]
  );

  const handleOpenDialog = React.useCallback(
    (key: Dialog) => {
      closeDrawer();
      openDialog(key);
    },
    [openDialog]
  );

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

  const renderDrawerItem: ListRenderItem<[string, DrawerItem]> =
    React.useCallback(
      ({ item }) => (
        <AnimatedListItem
          title={item[1].title}
          description={item[1].description}
          left={(props) => <List.Icon {...props} icon={item[1].icon} />}
          onPress={item[1].onClick}
          style={item[0] === "downloads" ? puslingStyles : undefined}
        />
      ),
      []
    );

  const renderDrawerContent = React.useCallback(() => {
    const keyExtractor = (item: [string, DrawerItem]) => item[0];
    return (
      <List.Section>
        <FlatList
          data={Object.entries(items)}
          renderItem={renderDrawerItem}
          keyExtractor={keyExtractor}
        />
      </List.Section>
    );
  }, [items]);

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
      renderDrawerContent={renderDrawerContent}
    >
      {children}
    </Drawer>
  );
};

DrawerWrapper.displayName = "DrawerWrapper";

export default DrawerWrapper;
