import * as React from 'react';
import {DataTable} from 'react-native-paper';
import ProvidersDataTableRow from './Row';
import ProvidersDataTableHeader from './Header';
import {CurrAppProps} from '@/hooks/useCurrApp';
import {ScrollView, StyleSheet, View} from 'react-native';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const LETTER_SIZE = 10;

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useAppProvidersDataTable(currApp: CurrAppProps) {
  const tableSize = React.useMemo(() => {
    const maxLengths = Object.entries(currApp.providers).reduce(
      (acc, [provider, {packageName, version}]) => ({
        provider: Math.max(acc.provider, provider.length),
        packageName: Math.max(acc.packageName, packageName.length),
        version: Math.max(acc.version, version.length),
      }),
      {provider: 8, packageName: 12, version: 7},
    );

    return {
      provider: maxLengths.provider * LETTER_SIZE,
      secure: 50,
      packageName: maxLengths.packageName * LETTER_SIZE,
      version: maxLengths.version * LETTER_SIZE,
      sha256: 150,
    };
  }, [currApp.providers]);

  return {tableSize};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface AppProvidersDataTableProps {
  currApp: CurrAppProps;
}

const AppProvidersDataTable = ({currApp}: AppProvidersDataTableProps) => {
  const {tableSize} = useAppProvidersDataTable(currApp);

  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal={true}>
        <DataTable>
          <ProvidersDataTableHeader tableSize={tableSize} />
          {Object.keys(currApp.providers).map(provider => (
            <ProvidersDataTableRow
              key={provider}
              currApp={currApp}
              provider={provider}
              tableSize={tableSize}
            />
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(AppProvidersDataTable);
