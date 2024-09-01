import * as React from "react";
import { useDefaultProviders } from "@/states/persistent/defaultProviders";
import { useIndex } from "@/states/fetched/index";
import { useVersions } from "@/states/computed/versions";
import { useUpdates } from "@/states/computed/updates";

function useStatesBridge() {
  const index = useIndex((state) => state.index);
  const [
    populatedDefaultProviders,
    sanitizeDefaultProviders,
    populateDefaultProviders,
  ] = useDefaultProviders((state) => [
    state.populatedDefaultProviders,
    state.sanitize,
    state.populate,
  ]);
  const [versions, refreshVersions] = useVersions((state) => [
    state.versions,
    state.refresh,
  ]);
  const refreshUpdates = useUpdates((state) => state.refresh);

  React.useEffect(() => {
    sanitizeDefaultProviders(index);
    populateDefaultProviders(index);
  }, [index]);

  React.useEffect(() => {
    refreshVersions(index, populatedDefaultProviders);
  }, [index, populatedDefaultProviders]);

  React.useEffect(() => {
    refreshUpdates(index, populatedDefaultProviders, versions);
  }, [index, populatedDefaultProviders, versions]);
}

const StatesBridgeManager = () => {
  useStatesBridge();

  return null;
};

StatesBridgeManager.displayName = "StatesBridgeManager";

export default StatesBridgeManager;
