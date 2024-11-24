import * as React from 'react';
import {useUpdates} from '@/states/computed/updates';
import {IndexAppProviderProps, useIndex} from '@/states/fetched';
import {interpolate, useTranslations} from '@/states/persistent/translations';
import {Download, useDownloads} from '@/states/runtime/downloads';
import {useToast} from '@/states/runtime/toast';
import {NavigationProps} from '@/types/navigation';
import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import UpdatesListItem from './UpdatesListItem';
import {useProviders} from '@/states/computed/providers';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export interface UpdatesListItemData {
  title: string;
  provider: IndexAppProviderProps;
  icon: string;
  download: Download | null;
}

export interface UpdatesListCommonProps {
  onPress: (appName: string) => void;
  onLongPress: (appName: string) => void;
  updateLabel: string;
}

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

const useUpdatesList = (
  updateApp: (appName: string, providerProps: IndexAppProviderProps) => void,
  updating: Record<string, string>,
) => {
  const index = useIndex(state => state.index);
  const populatedDefaultProviders = useProviders(
    state => state.populatedDefaultProviders,
  );
  const updates = useUpdates(state => state.updates);
  const downloads = useDownloads(state => state.downloads);
  const {navigate} = useNavigation<NavigationProps>();
  const translations = useTranslations(state => state.translations);
  const openToast = useToast(state => state.openToast);

  const updateListItemsData: UpdatesListItemData[] = React.useMemo(
    () =>
      updates.map(appName => ({
        title: appName,
        icon: index[appName].icon,
        provider: index[appName].providers[populatedDefaultProviders[appName]],
        download: updating[appName] ? downloads[updating[appName]] : null,
      })),
    [index, populatedDefaultProviders, updating, downloads, updates],
  );

  const updateListItemsCommonProps: UpdatesListCommonProps = React.useMemo(
    () => ({
      onPress: (appName: string) =>
        openToast(
          interpolate(translations['Long press to enter $1 page'], appName),
        ),
      onLongPress: (appName: string) => navigate('app', {app: appName}),
      updateLabel: translations['Update'],
    }),
    [translations, navigate],
  );

  const renderItem = React.useCallback(
    ({item}: {item: UpdatesListItemData}) => (
      <UpdatesListItem
        {...item}
        updateApp={updateApp}
        {...updateListItemsCommonProps}
      />
    ),
    [updateApp, updateListItemsCommonProps],
  );

  return {
    updateListItemsData,
    renderItem,
  };
};

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface UpdatesListProps {
  refreshControl: JSX.Element;
  updating: Record<string, string>;
  updateApp: (appName: string, providerProps: IndexAppProviderProps) => void;
}

const UpdatesList = ({
  refreshControl,
  updating,
  updateApp,
}: UpdatesListProps) => {
  const {updateListItemsData, renderItem} = useUpdatesList(updateApp, updating);

  return (
    <FlashList
      data={updateListItemsData}
      renderItem={renderItem}
      refreshControl={refreshControl}
      estimatedItemSize={124}
    />
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default UpdatesList;
