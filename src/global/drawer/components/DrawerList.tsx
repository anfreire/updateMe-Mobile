import * as React from 'react';
import {usePulsingStyles} from '@/hooks/usePulsing';
import {useTranslations} from '@/states/persistent/translations';
import {Dialog, useDialogs} from '@/states/runtime/dialogs';
import {useDownloads} from '@/states/runtime/downloads';
import {useDrawer} from '@/states/runtime/drawer';
import {MainStackPage, NavigationProps} from '@/types/navigation';
import {useNavigation} from '@react-navigation/native';
import {FlatList, Linking} from 'react-native';
import DrawerListItem, {DrawerListItemProps} from './DrawerListItem';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/
const REPORT_BUG_URL =
  'https://github.com/anfreire/updateMe-Mobile/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=%5BBUG%5D';
const SUGGEST_APP_URL =
  'https://github.com/anfreire/updateMe-Scraping/issues/new?assignees=&labels=&projects=&template=app-request.md&title=%5BAPP+REQUEST%5D+';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

const useDrawerList = () => {
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

  const items: DrawerListItemProps[] = React.useMemo(
    () => [
      {
        title: translations['Downloads'],
        description: translations['View your downloads'],
        icon: 'download',
        onClick: () => navigateTo('downloads'),
        style: pulsingStyles,
      },
      {
        title: translations['Updates'],
        description: translations['Check for updates'],
        icon: 'update',
        onClick: () => navigateTo('updates'),
      },
      {
        title: translations['Tips'],
        description: translations['Maximize your experience'],
        icon: 'star-four-points',
        onClick: () => navigateTo('tips-stack'),
      },
      {
        title: translations['Settings'],
        description: translations['Change the app settings'],
        icon: 'cog',
        onClick: () => navigateTo('settings'),
      },
      {
        key: "suggest",
        title: translations["Suggest"],
        description: translations["Suggest a new app"],
        icon: "lightbulb-on",
        onClick: () => Linking.openURL(SUGGEST_APP_URL),
      },
      {
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
        onClick: () => Linking.openURL(REPORT_BUG_URL),
      },
    ],
    [navigateTo, handleOpenDialog, translations],
  );

  return {items};
};

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const DrawerList = () => {
  const {items} = useDrawerList();

  return <FlatList data={items} renderItem={DrawerListItem} />;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default DrawerList;
