import { useCallback, useEffect } from "react";
import { useDefaultProviders } from "@/states/persistent/defaultProviders";
import { useIndex } from "@/states/temporary";
import { useVersions } from "@/states/computed/versions";
import { useCurrApp } from "@/states/computed/currApp";

function useStatesBridge() {
	const index = useIndex((state) => state.index);
	const defaultProviders = useDefaultProviders(
		(state) => state.defaultProviders,
	);
	const versions = useVersions((state) => state.versions);

	const sanitizeDefaultProviders = useCallback(() => {
		useDefaultProviders.getState().sanitize(index);
	}, [index]);

	const refreshVersions = useCallback(() => {
		useVersions.getState().refresh({ index, defaultProviders });
	}, [index, defaultProviders]);

	const refreshCurrApp = useCallback(() => {
		useCurrApp.getState().refresh({ index, versions, defaultProviders });
	}, [index, versions, defaultProviders]);

	useEffect(() => {
		sanitizeDefaultProviders();
	}, [sanitizeDefaultProviders]);

	useEffect(() => {
		refreshVersions();
	}, [refreshVersions]);

	useEffect(() => {
		refreshCurrApp();
	}, [refreshCurrApp]);
}

export function StatesBridgeManager() {
	useStatesBridge();

	return null;
}
