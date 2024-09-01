import * as React from "react";
import { Card, Text } from "react-native-paper";
import { Image, StyleSheet } from "react-native";

const MAX_IMAGE_SIZE = 100;

const calculateImageSize = (width: number, height: number) => ({
  width: MAX_IMAGE_SIZE * (width / height),
  height: MAX_IMAGE_SIZE,
});

interface AppLogoProps {
  title: string;
  icon: string;
}

const AppLogo = ({ title, icon }: AppLogoProps) => {
  const [imageSize, setImageSize] = React.useState({
    width: MAX_IMAGE_SIZE,
    height: MAX_IMAGE_SIZE,
  });

  React.useEffect(() => {
    Image.getSize(icon, (width, height) =>
      setImageSize(calculateImageSize(width, height))
    );
  }, [icon]);

  const paddingHorizontal = React.useMemo(
    () => (title.length > 15 ? 40 : 50),
    [title]
  );

  return (
    <Card contentStyle={[styles.card, { paddingHorizontal }]}>
      <Card.Cover
        resizeMode="contain"
        style={[styles.cardCover, imageSize]}
        source={{ uri: icon }}
      />
      <Text variant="headlineLarge">{title}</Text>
    </Card>
  );
};

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

AppLogo.displayName = "AppLogo";

export default React.memo(AppLogo);
