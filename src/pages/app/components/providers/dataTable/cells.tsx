import React, { memo } from "react";
import { Linking, ScrollView, View } from "react-native";
import { DataTable, Icon, Text } from "react-native-paper";
import Clipboard from "@react-native-clipboard/clipboard";
import MultiIcon from "@/components/multiIcon";
import { CurrAppProps } from "@/states/computed/currApp";
import { interpolate } from "@/states/persistent/translations";
import { useToast } from "@/states/temporary/toast";

interface CellProps {
  onPress: () => void;
  onLongPress: () => void;
  style: object;
  children: React.ReactNode;
}

export interface WebsiteCellProps {
  size: number;
  provider: string;
  currApp: CurrAppProps;
  translations: Record<string, string>;
}

export interface SecureCellProps {
  sha256: string;
  translations: Record<string, string>;
}

export interface CopiableCellProps {
  onPressMessage: string;
  onLongPressMessage: string;
  toCopy: string;
  width: number;
}

const Cell = ({ onPress, onLongPress, style, children }: CellProps) => (
  <DataTable.Cell onPress={onPress} onLongPress={onLongPress} style={style}>
    {children}
  </DataTable.Cell>
);

export const WebsiteCell = memo(
  ({ size, provider, currApp, translations }: WebsiteCellProps) => {
    const openToast = useToast((state) => state.openToast);

    return (
      <Cell
        onPress={() =>
          openToast(
            interpolate(translations["Long press to open $1 website"], provider)
          )
        }
        onLongPress={() => Linking.openURL(currApp.providers[provider].source)}
        style={{ width: size, justifyContent: "flex-start" }}
      >
        <View style={{ position: "relative" }}>
          <Text>{provider}</Text>
          <MultiIcon
            style={{ position: "absolute", top: -8, right: -12 }}
            size={10}
            type="material-icons"
            name="open-in-new"
          />
        </View>
      </Cell>
    );
  }
);

export const SecureCell = memo(({ sha256, translations }: SecureCellProps) => {
  const openToast = useToast((state) => state.openToast);

  return (
    <Cell
      onPress={() =>
        openToast(translations["Long press to open VirusTotal analysis"])
      }
      onLongPress={() =>
        Linking.openURL(`https://www.virustotal.com/gui/file/${sha256}`)
      }
      style={{ width: 70, justifyContent: "center" }}
    >
      <View style={{ position: "relative", width: 18, height: 18 }}>
        <Icon size={18} source={sha256 ? "check" : "close"} />
        <MultiIcon
          style={{ position: "absolute", top: -8, right: -10 }}
          size={10}
          type="material-icons"
          name="open-in-new"
        />
      </View>
    </Cell>
  );
});

export const CopiableCell = memo(
  ({
    onPressMessage,
    onLongPressMessage,
    toCopy,
    width,
  }: CopiableCellProps) => {
    const openToast = useToast((state) => state.openToast);

    return (
      <Cell
        onPress={() => openToast(onPressMessage)}
        onLongPress={() => {
          Clipboard.setString(toCopy);
          openToast(onLongPressMessage);
        }}
        style={{ width, justifyContent: "center" }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text>{toCopy}</Text>
        </ScrollView>
      </Cell>
    );
  }
);
