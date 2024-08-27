import * as React from "react";
import {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

export function usePulsing(isActive: boolean) {
	const opacity = useSharedValue(1);

	React.useEffect(() => {
		if (!isActive) return;

		opacity.value = withRepeat(
			withTiming(0.5, {
				duration: 600,
				easing: Easing.inOut(Easing.quad),
			}),
			-1,
			true,
		);

		const timer = setTimeout(() => {
			opacity.value = 1;
		}, 2500);

		return () => clearTimeout(timer);
	}, [isActive]);

	return useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));
}
