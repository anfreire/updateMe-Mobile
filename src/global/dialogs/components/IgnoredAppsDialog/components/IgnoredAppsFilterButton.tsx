import * as React from 'react';
import {IconButton} from 'react-native-paper';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const FILTER_BUTTON_ICONS = ['asterisk', 'eye', 'eye-off'];

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

function filterApps(apps: Record<string, boolean>, filter: number) {
  switch (filter) {
    case 1:
      return Object.fromEntries(
        Object.entries(apps).filter(([, ignored]) => !ignored),
      );
    case 2:
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

const useIgnoredAppsFilterButton = (
  apps: Record<string, boolean>,
  setFilteredApps: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >,
) => {
  const [filterButtonIndex, setFilterButtonIndex] = React.useState(0);

  const icon = FILTER_BUTTON_ICONS[filterButtonIndex];

  const handlePress = React.useCallback(
    () => setFilterButtonIndex(prev => (prev + 1) % FILTER_BUTTON_ICONS.length),
    [],
  );

  React.useEffect(() => {
    setFilteredApps(filterApps(apps, filterButtonIndex));
  }, [apps, filterButtonIndex, setFilteredApps]);

  return {
    icon,
    handlePress,
  };
};

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface IgnoredAppsFilterButtonProps {
  apps: Record<string, boolean>;
  setFilteredApps: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}

const IgnoredAppsFilterButton = ({
  apps,
  setFilteredApps,
}: IgnoredAppsFilterButtonProps) => {
  const {icon, handlePress} = useIgnoredAppsFilterButton(apps, setFilteredApps);

  return <IconButton icon={icon} onPress={handlePress} />;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(IgnoredAppsFilterButton);
