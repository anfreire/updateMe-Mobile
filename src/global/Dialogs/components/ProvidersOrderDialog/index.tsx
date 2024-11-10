import * as React from 'react';
import {Index, useIndex} from '@/states/fetched';
import {useSettings} from '@/states/persistent/settings';
import {useTranslations} from '@/states/persistent/translations';
import {useDialogs} from '@/states/runtime/dialogs';
import MultiPagesDialog, {PageButton} from '@/components/MultiPagesDialog';
import ProvidersPriorityList from './components/ProvidersPriorityList';
import ProvidersSelectionList from './components/ProvidersSelectionList';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const PROVIDERS_PRIORITY_PAGES_BUTTONS: PageButton[] = [
  {
    value: 'priority',
    label: 'Priority',
    icon: 'sort',
  },
  {
    value: 'selection',
    label: 'Selection',
    icon: 'playlist-plus',
  },
];

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/
type ProvidersPriorityPages = 'priority' | 'selection';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function getProviders(index: Index): string[] {
  const providers = new Set();
  for (const appData of Object.values(index)) {
    for (const provider in appData.providers) {
      providers.add(provider);
    }
  }
  return Array.from(providers) as string[];
}

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

const useProvidersOrderDialog = () => {
  const index = useIndex(state => state.index);
  const [providersOrder, setSetting] = useSettings(state => [
    state.settings.providers.providersOrder,
    state.setSetting,
  ]);
  const translations = useTranslations(state => state.translations);
  const activeDialog = useDialogs(state => state.activeDialog);
  const [activePage, setActivePage] =
    React.useState<ProvidersPriorityPages>('priority');
  const [orderedProviders, setOrderedProviders] = React.useState<string[]>([]);

  const labels = React.useMemo(() => {
    return {
      title: translations['Providers Priority'],
      info:
        activePage === 'priority'
          ? translations['Arrange providers in your preferred order']
          : translations['Choose providers to include in priority order'],
    };
  }, [translations, activePage]);

  const providers = React.useMemo(() => getProviders(index), [index]);

  const addProviderToOrder = React.useCallback((provider: string) => {
    setOrderedProviders(prev => [...prev, provider]);
  }, []);

  const removeProviderFromOrder = React.useCallback((provider: string) => {
    setOrderedProviders(prev => prev.filter(p => p !== provider));
  }, []);

  const onSave = React.useCallback(
    (closeDialog: () => void) => {
      setSetting('providers', 'providersOrder', orderedProviders);
      closeDialog();
    },
    [orderedProviders],
  );

  React.useEffect(() => {
    if (activeDialog !== 'providersOrder') return;

    setActivePage('priority');
    setOrderedProviders(providersOrder);
  }, [providersOrder, activeDialog]);

  return {
    labels,
    activeDialog,
    onSave,
    activePage,
    setActivePage,
    providers,
    orderedProviders,
    setOrderedProviders,
    addProviderToOrder,
    removeProviderFromOrder,
  };
};

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const ProvidersOrderDialog = () => {
  const {
    labels,
    activeDialog,
    onSave,
    activePage,
    setActivePage,
    providers,
    orderedProviders,
    setOrderedProviders,
    addProviderToOrder,
    removeProviderFromOrder,
  } = useProvidersOrderDialog();

  if (activeDialog !== 'providersOrder') {
    return null;
  }

  return (
    <MultiPagesDialog
      title={labels.title}
      info={labels.info}
      onSave={onSave}
      buttons={PROVIDERS_PRIORITY_PAGES_BUTTONS}
      activePage={activePage}
      setActivePage={
        setActivePage as React.Dispatch<React.SetStateAction<string>>
      }>
      {activePage === 'priority' ? (
        <ProvidersPriorityList
          orderedProviders={orderedProviders}
          setOrderedProviders={setOrderedProviders}
        />
      ) : (
        <ProvidersSelectionList
          providers={providers}
          orderedProviders={orderedProviders}
          addProviderToOrder={addProviderToOrder}
          removeProviderFromOrder={removeProviderFromOrder}
        />
      )}
    </MultiPagesDialog>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(ProvidersOrderDialog);
