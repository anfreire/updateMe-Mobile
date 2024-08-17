import { Card, DataTable, Icon, IconButton, Text } from "react-native-paper";
import { Linking, View } from "react-native";
import { useMemo } from "react";
import { ScrollView } from "react-native-gesture-handler";
import SHA256 from "./SHA256";
import { useDialogs } from "@/states/temporary/dialogs";
import { useToast } from "@/states/temporary/toast";
import ProvidersMenu from "./providersMenu";
import MultiIcon from "@/components/multiIcon";
import Clipboard from "@react-native-clipboard/clipboard";
import { CurrAppProps } from "@/states/computed/currApp";

export default function AppProvider({ currApp }: { currApp: CurrAppProps }) {
  const openDialog = useDialogs((state) => state.openDialog);
  const openToast = useToast((state) => state.openToast);

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
    <Card
      contentStyle={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexDirection: "column",
        padding: 30,
        paddingTop: Object.keys(currApp.providers).length > 1 ? 30 : 15,
        gap: 30,
      }}
    >
      {Object.keys(currApp.providers).length > 1 && (
        <View
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 7,
          }}
        >
          <Text variant="titleMedium">Selected Provider</Text>
          <ProvidersMenu currApp={currApp} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <ScrollView horizontal={true}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title
                style={{
                  justifyContent: "flex-start",
                  width: tableSize.provider,
                }}
              >
                Provider
              </DataTable.Title>
              <DataTable.Title
                style={{
                  justifyContent: "center",
                  width: 70,
                }}
              >
                Secure
              </DataTable.Title>
              <DataTable.Title
                style={{
                  justifyContent: "center",
                  width: tableSize.packageName,
                }}
              >
                Package Name
              </DataTable.Title>
              <DataTable.Title
                style={{
                  justifyContent: "center",
                  width: tableSize.version,
                }}
              >
                Version
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
            {Object.keys(currApp.providers).map((provider) => {
              return (
                <DataTable.Row key={provider}>
                  <DataTable.Cell
                    onPress={() =>
                      openToast(`Long press to open ${provider} website`)
                    }
                    onLongPress={() =>
                      Linking.openURL(currApp!.providers[provider].source)
                    }
                    style={{
                      width: tableSize.provider,
                      justifyContent: "flex-start",
                    }}
                  >
                    <View
                      style={{
                        position: "relative",
                      }}
                    >
                      <Text>{provider}</Text>
                      <MultiIcon
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -12,
                        }}
                        size={10}
                        type="material-icons"
                        name="open-in-new"
                      />
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell
                    key={provider + "-secure"}
                    style={{
                      width: 70,
                      justifyContent: "center",
                    }}
                    onLongPress={() =>
                      Linking.openURL(
                        `https://www.virustotal.com/gui/file/${currApp.providers[provider].sha256}`
                      )
                    }
                    onPress={() =>
                      openToast(`Long press to open VirusTotal analysis`)
                    }
                  >
                    <View
                      style={{
                        position: "relative",
                        width: 18,
                        height: 18,
                      }}
                    >
                      <Icon
                        size={18}
                        source={
                          currApp!.providers[provider].safe ? "check" : "close"
                        }
                      />
                      <MultiIcon
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -10,
                        }}
                        size={10}
                        type="material-icons"
                        name="open-in-new"
                      />
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell
                    key={provider + "-package"}
                    style={{
                      width: tableSize.packageName,
                      justifyContent: "center",
                    }}
                    onLongPress={() => {
                      Clipboard.setString(
                        currApp!.providers[provider].packageName
                      );
                      openToast(
                        `${provider}'s package name copied to clipboard`
                      );
                    }}
                    onPress={() =>
                      openToast(`Package names are unique app identifiers`)
                    }
                  >
                    {currApp!.providers[provider].packageName}
                  </DataTable.Cell>
                  <DataTable.Cell
                    key={provider + "-version"}
                    style={{
                      width: tableSize.version,
                      justifyContent: "center",
                    }}
                    onPress={() =>
                      openToast(`Versions are different app releases`)
                    }
                    onLongPress={() => {
                      Clipboard.setString(currApp!.providers[provider].version);
                      openToast(`${provider}'s version copied to clipboard`);
                    }}
                  >
                    {currApp!.providers[provider].version}
                  </DataTable.Cell>
                  <DataTable.Cell
                    key={provider + "-sha256"}
                    style={{
                      width: 175,
                      justifyContent: "flex-end",
                    }}
                    onPress={() =>
                      openToast(`SHA256 is a unique file identifier`)
                    }
                  >
                    <SHA256
                      appName={currApp!.name}
                      provider={provider}
                      sha256={currApp!.providers[provider].sha256}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable>
        </ScrollView>
      </View>
      {Object.keys(currApp!.providers).length > 1 && (
        <IconButton
          icon="information"
          style={{
            position: "absolute",
            top: 5,
            right: 5,
          }}
          onPress={() =>
            openDialog({
              title: "Providers",
              content:
                "Providers are different sources for the same app. Because they were made by different developers, they may have different versions, features or bugs.",
              actions: [
                {
                  title: "Ok",
                  action: () => {},
                },
              ],
            })
          }
        />
      )}
    </Card>
  );
}
