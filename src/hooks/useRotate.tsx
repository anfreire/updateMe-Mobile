import * as React from "react";
import {
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withSpring,
	cancelAnimation,
} from "react-native-reanimated";

export function useRotate() {
	const rotation = useSharedValue(0);

	const startRotating = React.useCallback(() => {
		if (rotation.value !== 0) {
			return;
		}
		rotation.value = withSpring(
			360,
			{
				mass: 7,
				damping: 40,
				stiffness: 100,
			},
			() => {
				rotation.value = 0;
			},
		);
	}, []);

	const cancelRotating = React.useCallback(() => {
		cancelAnimation(rotation);
	}, []);

	const rotationDegrees = useDerivedValue(() => `${rotation.value}deg`);

	const rotatingStyles = useAnimatedStyle(() => ({
		transform: [{ rotate: rotationDegrees.value }],
	}));

	return { startRotating, cancelRotating, rotatingStyles };
}
