import * as React from "react";
import { StyleSheet } from "react-native";
import { DataTable, Text } from "react-native-paper";

const AppInfoDataRow = ({
  title,
  value,
  valueColor,
}: {
  title: string;
  value: string;
  valueColor?: string;
}) => (
  <DataTable.Row>
    <DataTable.Cell style={styles.titleCell}>
      <Text style={styles.titleText}>{title}</Text>
    </DataTable.Cell>
    <DataTable.Cell style={styles.versionCell}>
      <Text style={{ color: valueColor }}>{value}</Text>
    </DataTable.Cell>
  </DataTable.Row>
);

const styles = StyleSheet.create({
  titleCell: {
    justifyContent: "flex-end",
    marginRight: 10,
  },
  titleText: {
    fontWeight: "bold",
  },
  versionCell: {
    justifyContent: "flex-start",
  },
});

AppInfoDataRow.displayName = "AppInfoDataRow";

export default React.memo(AppInfoDataRow);
