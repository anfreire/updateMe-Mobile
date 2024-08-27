import * as React from "react";
import LoadingView from "@/components/loadingView";
import { useTips } from "@/states/temporary/tips";
import { useTheme } from "@/theme";
import { Dimensions, ScrollView, View } from "react-native";
import FastImage from "react-native-fast-image";
import { FlatList } from "react-native-gesture-handler";
import { Text } from "react-native-paper";

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
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          gap: 15,
          margin: 20,
          marginVertical: 30,
          width: WIDTH + 80,
          padding: 20,
          paddingVertical: 30,
          elevation: 1,
          backgroundColor: theme.schemedTheme.elevation.level1,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={{ uri: content.image }}
          style={{
            width: WIDTH,
            height: HEIGHT,
            borderRadius: 5,
          }}
        />
        <Text
          variant="bodyLarge"
          style={{
            textAlign: "center",
          }}
        >
          {content.description}
        </Text>
      </View>
    </View>
  );
}

export default function TipScreen() {
  const [tips, currTip] = useTips((state) => [state.tips, state.currTip]);

  if (currTip === null) {
    return <LoadingView />;
  }
  return (
    <FlatList
      data={tips[currTip as string].content}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => <Step content={item} />}
      contentContainerStyle={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    ></FlatList>
  );
}
