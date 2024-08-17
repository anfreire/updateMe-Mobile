import React, { useEffect, useState, useMemo, memo } from "react";
import { Card, Text } from "react-native-paper";
import { Image, StyleSheet } from "react-native";
import { CurrAppProps } from "@/states/computed/currApp";

const MAX_IMAGE_SIZE = 100;

const calculateImageSize = (width: number, height: number) => ({
  width: MAX_IMAGE_SIZE * (width / height),
  height: MAX_IMAGE_SIZE,
});

function AppLogo({ currApp }: { currApp: CurrAppProps }) {
  const [imageSize, setImageSize] = useState({
    width: MAX_IMAGE_SIZE,
    height: MAX_IMAGE_SIZE,
  });

  useEffect(() => {
    Image.getSize(currApp.icon, (width, height) =>
      setImageSize(calculateImageSize(width, height))
    );
  }, [currApp.icon]);

  const paddingHorizontal = useMemo(
    () => (currApp.name.length > 15 ? 40 : 50),
    [currApp.name]
  );

  return (
    <Card contentStyle={[styles.card, { paddingHorizontal }]}>
      <Card.Cover
        resizeMode="contain"
        style={[styles.cardCover, imageSize]}
        source={{ uri: currApp.icon }}
      />
      <Text variant="headlineLarge">{currApp.name}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: 30,
    paddingBottom: 20,
    gap: 20,
  },
  cardCover: {
    backgroundColor: "transparent",
  },
});

export default memo(AppLogo);
