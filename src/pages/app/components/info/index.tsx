import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Card, DataTable} from 'react-native-paper';
import {useTheme} from '@/theme';
import {useTranslations} from '@/states/persistent/translations';
import DataRow from './dataRow';
import AppInfoButtons from './buttons';
import {CurrAppProps} from '@/hooks/useCurrApp';

interface AppInfoProps {
  currApp: CurrAppProps;
}

const AppInfo = ({currApp}: AppInfoProps) => {
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
  console.log('AppInfo rendered', localVersionProps);

  return (
    <Card contentStyle={styles.card}>
      <DataTable>
        <DataRow
          title={translations['Local Version']}
          value={localVersionProps.version}
          valueColor={localVersionProps.color}
        />
        <DataRow
          title={translations['Available Version']}
          value={currApp.defaultProvider.version}
        />
      </DataTable>
      <AppInfoButtons currApp={currApp} />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
});

AppInfo.displayName = 'AppInfo';

export default React.memo(AppInfo);
