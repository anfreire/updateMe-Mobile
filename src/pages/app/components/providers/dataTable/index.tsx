import { CurrAppProps } from "@/states/computed/currApp";
import { memo, useMemo } from "react";
import { DataTable } from "react-native-paper";
import ProvidersDataTableRow from "./row";
import ProvidersDataTableHeader from "./header";

const ProvidersDataTable = memo(({ currApp }: { currApp: CurrAppProps }) => {
  const tableSize = useMemo(() => {
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
});

export default ProvidersDataTable;
