import * as React from "react";
import { DataTable } from "react-native-paper";
import ProvidersDataTableRow from "./row";
import ProvidersDataTableHeader from "./header";
import { CurrAppProps } from "@/hooks/useCurrApp";

const ProvidersDataTable = ({ currApp }: { currApp: CurrAppProps }) => {
  const tableSize = React.useMemo(() => {
    const maxLengths = Object.entries(currApp.providers).reduce(
      (acc, [provider, { packageName, version }]) => ({
        provider: Math.max(acc.provider, provider.length),
        packageName: Math.max(acc.packageName, packageName.length),
        version: Math.max(acc.version, version.length),
      }),
      { provider: 8, packageName: 12, version: 7 }
    );

    return {
      provider: maxLengths.provider * 9 + 5,
      packageName: maxLengths.packageName * 9 + 5,
      version: maxLengths.version * 9 + 5,
    };
  }, [currApp.providers]);

  return (
    <DataTable>
      <ProvidersDataTableHeader tableSize={tableSize} />
      {Object.keys(currApp.providers).map((provider) => (
        <ProvidersDataTableRow
          key={provider}
          currApp={currApp}
          provider={provider}
          tableSize={tableSize}
        />
      ))}
    </DataTable>
  );
};

ProvidersDataTable.displayName = "ProvidersDataTable";

export default React.memo(ProvidersDataTable);
