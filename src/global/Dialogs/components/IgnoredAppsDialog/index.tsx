import * as React from 'react';
import {useTranslations} from '@/states/persistent/translations';
import {useSettings} from '@/states/persistent/settings';
import {Index, useIndex} from '@/states/fetched';
import IgnoredAppsList from './components/IgnoredAppsList';
import MultiPagesDialog, {PageButton} from '@/components/MultiPagesDialog';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const IGNORE_APPS_DIALOG_PAGES_BUTTONS: PageButton[] = [
  {
    value: 'all',
    label: 'All',
    icon: 'asterisk',
  },
  {
    value: 'notIgnored',
    label: 'Active',
    icon: 'sync',
  },
  {
    value: 'ignored',
    label: 'Disabled',
    icon: 'sync-off',
  },
];

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/
type IgnoredAppsDialogPages = 'all' | 'notIgnored' | 'ignored';

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function getApps(index: Index, ignoredApps: string[] = []) {
  const ignoredSet = new Set(ignoredApps);

  return Object.fromEntries(
    Object.keys(index).map(provider => [provider, ignoredSet.has(provider)]),
  );
}

function filterApps(
  apps: Record<string, boolean>,
  filter: IgnoredAppsDialogPages,
) {
  switch (filter) {
    case 'notIgnored':
      return Object.fromEntries(
        Object.entries(apps).filter(([, ignored]) => !ignored),
      );
    case 'ignored':
      return Object.fromEntries(
        Object.entries(apps).filter(([, ignored]) => ignored),
      );
    default:
      return apps;
  }
}

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useIgnoredAppsDialog() {
  const index = useIndex(state => state.index);
  const [ignoredApps, setSetting] = useSettings(state => [
    state.settings.apps.ignoredApps,
    state.setSetting,
  ]);
  const translations = useTranslations(state => state.translations);

  const [apps, setApps] = React.useState(getApps(index, ignoredApps));
  const [filteredApps, setFilteredApps] = React.useState(apps);
  const [activePage, setActivePage] =
    React.useState<IgnoredAppsDialogPages>('all');

  const labels = React.useMemo(
    () => ({
      title: translations['Apps to Update'],
      info: translations['Disabled apps will not receive updates'],
    }),
    [translations],
  );

  const handleToggle = React.useCallback((provider: string) => {
    setApps(prev => ({
      ...prev,
      [provider]: !prev[provider],
    }));
  }, []);

  const onSave = React.useCallback(
    (closeDialog: () => void) => {
      setSetting(
        'apps',
        'ignoredApps',
        Object.keys(apps).filter(app => apps[app]),
      );
      closeDialog();
    },
    [apps],
  );

  React.useEffect(() => {
    setFilteredApps(filterApps(apps, activePage));
  }, [apps, activePage]);

  React.useEffect(() => {
    setActivePage('all');
    setApps(getApps(index, ignoredApps));
  }, [index, ignoredApps]);

  return {
    labels,
    handleToggle,
    onSave,
    filteredApps,
    activePage,
    setActivePage,
  };
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const IgnoredAppsDialog = () => {
  const {
    filteredApps,
    labels,
    handleToggle,
    onSave,
    activePage,
    setActivePage,
  } = useIgnoredAppsDialog();

  return (
    <MultiPagesDialog
      {...labels}
      activePage={activePage}
      onSave={onSave}
      setActivePage={
        setActivePage as React.Dispatch<React.SetStateAction<string>>
      }
      buttons={IGNORE_APPS_DIALOG_PAGES_BUTTONS}>
      <IgnoredAppsList
        filteredApps={filteredApps}
        handleToggle={handleToggle}
      />
    </MultiPagesDialog>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(IgnoredAppsDialog);
