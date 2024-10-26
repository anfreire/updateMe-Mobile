import * as React from 'react';
import {StyleSheet} from 'react-native';
import {DataTable} from 'react-native-paper';

/*******************************************************************************
 *                                  COMPONENT                                  *
 *******************************************************************************/

interface AppInfoDataRowProps {
  title: string;
  value: string;
  valueColor?: string;
}

const AppInfoDataRow = ({title, value, valueColor}: AppInfoDataRowProps) => (
  <DataTable.Row>
    <DataTable.Cell textStyle={styles.titleText} style={styles.titleCell}>
      {title}
    </DataTable.Cell>
    <DataTable.Cell textStyle={{color: valueColor}} style={styles.versionCell}>
      {value}
    </DataTable.Cell>
  </DataTable.Row>
);

/*******************************************************************************
 *                                    STYLES                                   *
 *******************************************************************************/

const styles = StyleSheet.create({
  titleCell: {
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  titleText: {
    fontWeight: 'bold',
  },
  versionCell: {
    justifyContent: 'flex-start',
  },
});

/*******************************************************************************
 *                                    EXPORT                                   *
 *******************************************************************************/

export default React.memo(AppInfoDataRow);
