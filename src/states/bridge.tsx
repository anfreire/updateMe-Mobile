import * as React from "react";
import { useDefaultProviders } from "@/states/persistent/defaultProviders";
import { useIndex } from "@/states/temporary";
import { useVersions } from "@/states/computed/versions";

function useStatesBridge() {
  const index = useIndex((state) => state.index);
  const [defaultProviders, sanitizeDefaultProviders] = useDefaultProviders(
    (state) => [state.defaultProviders, state.sanitize]
  );
  const refreshVersions = useVersions((state) => state.refresh);

  React.useEffect(() => {
    sanitizeDefaultProviders(index);
  }, [index]);

  React.useEffect(() => {
    refreshVersions({ index, defaultProviders });
  }, [index, defaultProviders]);
}

const StatesBridgeManager = () => {
  useStatesBridge();

  return null;
};

StatesBridgeManager.displayName = "StatesBridgeManager";

export default StatesBridgeManager;
