import * as React from "react";
import { useTranslations } from "@/states/persistent/translations";
import { DataTable } from "react-native-paper";
import { StyleSheet } from "react-native";

const sha256Title = "SHA256";

const ProvidersDataTableHeader = ({
  tableSize,
}: {
  tableSize: { provider: number; packageName: number; version: number };
}) => {
  const translations = useTranslations((state) => state.translations);
  return (
    <DataTable.Header>
      <DataTable.Title
        style={[{ width: tableSize.provider }, styles.providerTitle]}
      >
        {translations["Provider"]}
      </DataTable.Title>
      <DataTable.Title style={styles.secureTitle}>
        {translations["Secure"]}
      </DataTable.Title>
      <DataTable.Title
        style={[{ width: tableSize.packageName }, styles.packageNameTitle]}
      >
        {translations["Package Name"]}
      </DataTable.Title>
      <DataTable.Title
        style={[{ width: tableSize.version }, styles.versionTitle]}
      >
        {translations["Version"]}
      </DataTable.Title>
      <DataTable.Title style={styles.sha256Title}>
        {sha256Title}
      </DataTable.Title>
    </DataTable.Header>
  );
};

ProvidersDataTableHeader.displayName = "ProvidersDataTableHeader";

export default React.memo(ProvidersDataTableHeader);

const styles = StyleSheet.create({
  providerTitle: {
    justifyContent: "flex-start",
  },
  secureTitle: {
    justifyContent: "center",
    width: 70,
  },
  packageNameTitle: {
    justifyContent: "center",
  },
  versionTitle: {
    justifyContent: "center",
  },
  sha256Title: {
    justifyContent: "center",
    width: 175,
  },
});
