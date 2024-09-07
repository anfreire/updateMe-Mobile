import * as React from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { DataTable, Icon, Text } from "react-native-paper";
import Clipboard from "@react-native-clipboard/clipboard";
import MultiIcon from "@/components/multiIcon";
import { interpolate } from "@/states/persistent/translations";
import { CurrAppProps } from "@/hooks/useCurrApp";
import { useToast } from "@/states/runtime/toast";

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

export const WebsiteCell = React.memo(
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
        style={[styles.websiteWrapper, { width: size }]}
      >
        <View style={styles.websiteView}>
          <Text>{provider}</Text>
          <MultiIcon
            style={styles.websiteIcon}
            size={10}
            type="material-icons"
            name="open-in-new"
          />
        </View>
      </Cell>
    );
  }
);

export const SecureCell = React.memo(
  ({ sha256, translations }: SecureCellProps) => {
    const openToast = useToast((state) => state.openToast);

    return (
      <Cell
        onPress={() =>
          openToast(translations["Long press to open VirusTotal analysis"])
        }
        onLongPress={() =>
          Linking.openURL(`https://www.virustotal.com/gui/file/${sha256}`)
        }
        style={styles.secureWrapper}
      >
        <View style={styles.secureView}>
          <Icon size={18} source={sha256 ? "check" : "close"} />
          <MultiIcon
            style={styles.secureIcon}
            size={10}
            type="material-icons"
            name="open-in-new"
          />
        </View>
      </Cell>
    );
  }
);

export const CopiableCell = React.memo(
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
        style={[{ width }, styles.copiableWrapper]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text>{toCopy}</Text>
        </ScrollView>
      </Cell>
    );
  }
);

const styles = StyleSheet.create({
  websiteWrapper: {
    justifyContent: "flex-start",
  },
  websiteView: {
    position: "relative",
  },
  websiteIcon: {
    position: "absolute",
    top: -8,
    right: -12,
  },
  secureWrapper: {
    justifyContent: "center",
    width: 70,
  },
  secureView: {
    position: "relative",
    width: 18,
    height: 18,
  },
  secureIcon: {
    position: "absolute",
    top: -8,
    right: -10,
  },
  copiableWrapper: {
    justifyContent: "center",
  },
});
