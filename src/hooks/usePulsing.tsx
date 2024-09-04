import * as React from "react";
import {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
	cancelAnimation,
} from "react-native-reanimated";

export function usePulsing() {
	const opacity = useSharedValue(1);

	const startPulsing = React.useCallback(() => {
		if (opacity.value !== 1) {
			return;
		}
		opacity.value = withRepeat(
			withTiming(0.5, {
				duration: 600,
				easing: Easing.inOut(Easing.quad),
			}),
			-1,
			true,
		);
	}, []);

	const cancelPulsing = React.useCallback(() => {
		cancelAnimation(opacity);
	}, []);

	const pulsingStyles = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	return { startPulsing, cancelPulsing, pulsingStyles };
}
