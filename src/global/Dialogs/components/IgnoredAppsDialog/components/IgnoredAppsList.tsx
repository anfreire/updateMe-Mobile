import * as React from 'react';
import {FlashList} from '@shopify/flash-list';
import IgnoredAppsItem from './IgnoredAppsItem';
import {useIndex} from '@/states/fetched';
import {useTheme} from '@/theme';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

const useIgnoredAppsList = (
  filteredApps: Record<string, boolean>,
  handleToggle: (app: string) => void,
) => {
  const index = useIndex(state => state.index);
  const {schemedTheme} = useTheme();

  const backgroundColor = schemedTheme.elevation.level3;

  const iconColors = React.useMemo(
    () => ({
      true: {
        icon: schemedTheme.onSecondary,
        container: schemedTheme.secondary,
        wrapper: schemedTheme.elevation.level5,
      },
      false: {
        icon: schemedTheme.onPrimary,
        container: schemedTheme.primary,
        wrapper: schemedTheme.elevation.level1,
      },
    }),
    [schemedTheme],
  );

  const listData = React.useMemo(
    () =>
      Object.entries(filteredApps)
        .map(([app, checked]) => ({
          icon: index[app].icon,
          colors: iconColors[String(checked) as 'true' | 'false'],
          app,
          checked,
          onPress: () => handleToggle(app),
        }))
        .sort((a, b) => a.app.localeCompare(b.app)),
    [filteredApps, handleToggle, index, iconColors],
  );

  return {
    backgroundColor,
    listData,
  };
};

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface IgnoredAppsListProps {
  filteredApps: Record<string, boolean>;
  handleToggle: (app: string) => void;
}

const IgnoredAppsList = ({
  filteredApps,
  handleToggle,
}: IgnoredAppsListProps) => {
  const {backgroundColor, listData} = useIgnoredAppsList(
    filteredApps,
    handleToggle,
  );

  return (
    <FlashList
      contentContainerStyle={{backgroundColor}}
      data={listData}
      renderItem={IgnoredAppsItem}
      estimatedItemSize={124}
    />
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(IgnoredAppsList);
