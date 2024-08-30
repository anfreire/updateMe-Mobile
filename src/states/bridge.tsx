import * as React from "react";
import { useCallback, useEffect } from "react";
import { useDefaultProviders } from "@/states/persistent/defaultProviders";
import { useIndex } from "@/states/temporary";
import { useVersions } from "@/states/computed/versions";
import { useCurrApp } from "@/states/computed/currApp";

function useStatesBridge() {
	const index = useIndex((state) => state.index);
	const [defaultProviders, sanitizeDefaultProviders] = useDefaultProviders(
		(state) => [state.defaultProviders, state.sanitize],
	);
	const [versions, refreshVersions] = useVersions((state) => [
		state.versions,
		state.refresh,
	]);

	const handleSanitizeDefaultProviders = useCallback(() => {
		useDefaultProviders.getState().sanitize(index);
	}, [index]);

	const handleRefreshVersions = useCallback(() => {
		useVersions.getState().refresh({ index, defaultProviders });
	}, [index, defaultProviders]);

	useEffect(() => {
		handleSanitizeDefaultProviders();
	}, [sanitizeDefaultProviders]);

	useEffect(() => {
		handleRefreshVersions();
	}, [refreshVersions]);
}

export function StatesBridgeManager() {
	useStatesBridge();

	return null;
}
