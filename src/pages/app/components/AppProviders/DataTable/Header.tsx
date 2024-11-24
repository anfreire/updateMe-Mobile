import * as React from 'react';
import {useTranslations} from '@/states/persistent/translations';
import {DataTable} from 'react-native-paper';
import {StyleSheet} from 'react-native';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const SHA256_TITLE = 'SHA256';

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

function useAppProvidersDataTableHeader() {
  const translations = useTranslations(state => state.translations);

  return {translations};
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface AppProvidersDataTableHeaderProps {
  tableSize: {
    provider: number;
    secure: number;
    packageName: number;
    version: number;
    sha256: number;
  };
}

const AppProvidersDataTableHeader = ({
  tableSize,
}: AppProvidersDataTableHeaderProps) => {
  const {translations} = useAppProvidersDataTableHeader();

  return (
    <DataTable.Header>
      <DataTable.Title style={[styles.firstCell, {width: tableSize.provider}]}>
        {translations['Provider']}
      </DataTable.Title>
      <DataTable.Title style={[styles.otherCells, {width: tableSize.secure}]}>
        {translations['Secure']}
      </DataTable.Title>
      <DataTable.Title
        style={[styles.otherCells, {width: tableSize.packageName}]}>
        {translations['Package Name']}
      </DataTable.Title>
      <DataTable.Title style={[styles.otherCells, {width: tableSize.version}]}>
        {translations['Version']}
      </DataTable.Title>
      <DataTable.Title style={[styles.otherCells, {width: tableSize.sha256}]}>
        {SHA256_TITLE}
      </DataTable.Title>
    </DataTable.Header>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  firstCell: {
    justifyContent: 'flex-start',
    marginHorizontal: 10,
  },
  otherCells: {
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(AppProvidersDataTableHeader);
