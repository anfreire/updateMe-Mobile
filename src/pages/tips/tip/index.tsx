import * as React from "react";
import LoadingView from "@/components/loadingView";
import { useTips } from "@/states/fetched/tips";
import { useTheme } from "@/theme";
import { FlatList, Dimensions, View, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import { Text } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { Page, RouteProps } from "@/types/navigation";
import { useCurrPageEffect } from "@/hooks/useCurrPageEffect";

const CURR_PAGE: Page = "tip";

const HEIGHT = 0.65 * Dimensions.get("window").height;
const WIDTH = (320 / 711) * HEIGHT;

function Step({
  content,
}: {
  content: {
    image: string;
    description: string;
  };
}) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.wrapper,
          { backgroundColor: theme.schemedTheme.elevation.level1 },
        ]}
      >
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={{ uri: content.image }}
          style={styles.image}
        />
        <Text variant="bodyLarge" style={styles.text}>
          {content.description}
        </Text>
      </View>
    </View>
  );
}

const TipScreen = () => {
  const tips = useTips((state) => state.tips);
  const { params } = useRoute<RouteProps>();

  useCurrPageEffect(CURR_PAGE);

  if (!params || !("tip" in params)) {
    return <LoadingView />;
  }
  return (
    <FlatList
      data={tips[params.tip].content}
      renderItem={({ item }) => <Step content={item} />}
      contentContainerStyle={styles.flatListContainer}
    />
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    gap: 15,
    margin: 20,
    marginVertical: 30,
    width: WIDTH + 80,
    padding: 20,
    paddingVertical: 30,
    elevation: 1,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: WIDTH,
    height: HEIGHT,
    borderRadius: 5,
  },
  text: {
    textAlign: "center",
  },
});

TipScreen.displayName = "TipScreen";

export default TipScreen;
