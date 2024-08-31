import * as React from "react";
import { useTranslations } from "@/states/persistent/translations";
import { DataTable } from "react-native-paper";

const ProvidersDataTableHeader = memo(
  ({
    tableSize,
  }: {
    tableSize: { provider: number; packageName: number; version: number };
  }) => {
    const translations = useTranslations((state) => state.translations);
    return (
      <DataTable.Header>
        <DataTable.Title
          style={{
            justifyContent: "flex-start",
            width: tableSize.provider,
          }}
        >
          {translations["Provider"]}
        </DataTable.Title>
        <DataTable.Title
          style={{
            justifyContent: "center",
            width: 70,
          }}
        >
          {translations["Secure"]}
        </DataTable.Title>
        <DataTable.Title
          style={{
            justifyContent: "center",
            width: tableSize.packageName,
          }}
        >
          {translations["Package Name"]}
        </DataTable.Title>
        <DataTable.Title
          style={{
            justifyContent: "center",
            width: tableSize.version,
          }}
        >
          {translations["Version"]}
        </DataTable.Title>
        <DataTable.Title
          style={{
            justifyContent: "center",
            width: 175,
          }}
        >
          SHA256
        </DataTable.Title>
      </DataTable.Header>
    );
  }
);

export default ProvidersDataTableHeader;
