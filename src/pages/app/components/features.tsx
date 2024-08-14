import { Card, Text } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";
import { StyleSheet, View } from "react-native";
import { CurrAppProps, useCurrAppProps } from "@/states/computed/currApp";
import { memo, useMemo } from "react";

const renderItem = ({ item }: { item: string }) => (
	<View style={styles.item}>
		<Text variant="bodyMedium" style={styles.text}>
			{item}
		</Text>
	</View>
);

function AppFeatures({ currApp }: { currApp: CurrAppProps }) {
	const features = useMemo(() => currApp.features ?? [], [currApp.features]);
	return (
		<Card contentStyle={styles.card}>
			<Text variant="titleLarge">Features</Text>
			<Carousel
				width={300}
				height={50}
				loop
				autoPlay={true}
				data={features}
				renderItem={renderItem}
			/>
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		padding: 20,
		gap: 10,
	},
	item: {
		width: 300,
		height: 50,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		alignContent: "center",
	},
	text: {
		textAlign: "center",
	},
});

export default memo(AppFeatures);
