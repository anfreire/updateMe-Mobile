import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Card, DataTable} from 'react-native-paper';
import {useTheme} from '@/theme';
import {useTranslations} from '@/states/persistent/translations';
import {CurrAppProps} from '@/hooks/useCurrApp';
import DataRow from './AppInfoDataRow';
import AppInfoButton from './AppInfoButton';

/*******************************************************************************
 *                                     HOOK                                    *
 *******************************************************************************/

function useAppInfo(currApp: CurrAppProps) {
  const theme = useTheme();
  const translations = useTranslations(state => state.translations);
  const localVersionProps = React.useMemo(
    () => ({
      color: currApp.version === null ? theme.schemedTheme.error : undefined,
      version:
        currApp.version == null
          ? translations['Not installed']
          : currApp.version,
    }),
    [currApp, theme.schemedTheme.error, translations],
  );

  const localVersionLabel = translations['Local Version'];
  const availableVersionLabel = translations['Available Version'];

  return {localVersionProps, localVersionLabel, availableVersionLabel};
}

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

interface AppInfoProps {
  currApp: CurrAppProps;
}

const AppInfo = ({currApp}: AppInfoProps) => {
  const {localVersionProps, localVersionLabel, availableVersionLabel} =
    useAppInfo(currApp);

  return (
    <Card contentStyle={styles.card}>
      <DataTable>
        <DataRow
          title={availableVersionLabel}
          value={currApp.defaultProvider.version}
        />
        <DataRow
          title={localVersionLabel}
          value={localVersionProps.version}
          valueColor={localVersionProps.color}
        />
      </DataTable>
      <AppInfoButton currApp={currApp} />
    </Card>
  );
};

/*******************************************************************************
 *                                    STYLES                                   *
 *******************************************************************************/

const styles = StyleSheet.create({
  card: {
    minWidth: 325,
    width: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
});

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default React.memo(AppInfo);
