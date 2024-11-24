import {FlashList} from '@shopify/flash-list';
import * as React from 'react';
import ProvidersSelectionListItem from './ProvidersSelectionListItem';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

const useProvidersSelectionList = (
  providers: string[],
  orderedProviders: string[],
  addProviderToOrder: (provider: string) => void,
  removeProviderFromOrder: (provider: string) => void,
) => {
  const providersSelectionData = React.useMemo(
    () =>
      providers.map(provider => {
        if (orderedProviders.includes(provider)) {
          return {
            provider,
            checked: true,
            onPress: () => removeProviderFromOrder(provider),
          };
        }
        return {
          provider,
          checked: false,
          onPress: () => addProviderToOrder(provider),
        };
      }),
    [providers, orderedProviders, addProviderToOrder, removeProviderFromOrder],
  );
  return {providersSelectionData};
};

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface ProvidersSelectionListProps {
  providers: string[];
  orderedProviders: string[];
  addProviderToOrder: (provider: string) => void;
  removeProviderFromOrder: (provider: string) => void;
}

const ProvidersSelectionList = ({
  providers,
  orderedProviders,
  addProviderToOrder,
  removeProviderFromOrder,
}: ProvidersSelectionListProps) => {
  const {providersSelectionData} = useProvidersSelectionList(
    providers,
    orderedProviders,
    addProviderToOrder,
    removeProviderFromOrder,
  );

  return (
    <FlashList
      data={providersSelectionData}
      renderItem={ProvidersSelectionListItem}
      estimatedItemSize={124}
    />
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(ProvidersSelectionList);
