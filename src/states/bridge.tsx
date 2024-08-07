import { useCallback, useEffect } from "react";
import { useDefaultProviders } from "./persistent/defaultProviders";
import { useIndex } from "./temporary";
import { useVersions } from "./computed/versions";
import { useCurrApp } from "./computed/currApp";

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
