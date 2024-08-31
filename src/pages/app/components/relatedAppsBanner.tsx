import * as React from "react";
import { Banner } from "react-native-paper";
import { useSession } from "@/states/temporary/session";
import { CurrAppProps, useCurrApp } from "@/states/computed/currApp";
import {
  Translation,
  interpolate,
  useTranslations,
} from "@/states/persistent/translations";
import { useVersions } from "@/states/computed/versions";
import { useIndex } from "@/states/temporary";
import { useDefaultProviders } from "@/states/persistent/defaultProviders";
import { useNavigate } from "@/hooks/navigation";

const BannerAppsKeys = [
  "missingDependencies",
  "outdatedDependencies",
  "outdatedComplementaryApps",
] as const;

const Messages: Record<
  (typeof BannerAppsKeys)[number],
  Record<"singular" | "plural", Translation>
> = {
  missingDependencies: {
    singular: "This app is missing the dependency $1",
    plural: "This app is missing the dependencies $1 and $2",
  },
  outdatedDependencies: {
    singular: "This app has an outdated dependency $1",
    plural: "This app has outdated dependencies $1 and $2",
  },
  outdatedComplementaryApps: {
    singular: "This app has an outdated complementary app $1",
    plural: "This app has outdated complementary apps $1 and $2",
  },
};

export default function RelatedAppsBanner({
  currApp,
}: {
  currApp: CurrAppProps;
}) {
  const [appsDismissed, addSessionProp] = useSession((state) => [
    state.trackers.updatesBannerDismissed,
    state.addTracker,
  ]);
  const translations = useTranslations();
  const [versions, updates] = useVersions((state) => [
    state.versions,
    state.updates,
  ]);
  const setCurrApp = useCurrApp((state) => state.setCurrApp);
  const index = useIndex((state) => state.index);
  const defaultProviders = useDefaultProviders(
    (state) => state.defaultProviders
  );
  const navigate = useNavigate();

  const data = useMemo(
    () => ({
      missingDependencies: currApp.depends.filter(
        (dep) => versions[dep] === null
      ),
      outdatedDependencies: currApp.depends.filter((dep) =>
        updates.includes(dep)
      ),
      outdatedComplementaryApps: currApp.complements.filter((complement) =>
        updates.includes(complement)
      ),
    }),
    [currApp.depends, currApp.complements, versions, updates]
  );

  const message = useMemo(() => {
    if (appsDismissed.includes(currApp.name)) return null;
    for (const key of BannerAppsKeys) {
      if (data[key].length === 0) continue;
      const apps = data[key].filter((app) => !appsDismissed.includes(app));
      if (apps.length === 0) continue;
      return apps.length === 1
        ? interpolate(translations[Messages[key].singular], apps[0])
        : interpolate(
            translations[Messages[key].plural],
            apps.slice(0, -1).join(", "),
            apps.slice(-1)[0]
          );
    }
    return null;
  }, [data, appsDismissed, currApp.name, translations]);

  const handleUpdate = useCallback(() => {
    if (data.missingDependencies.length > 0) {
      setCurrApp(data.missingDependencies[0], {
        index,
        versions,
        defaultProviders,
      });
    } else {
      navigate("updates");
    }
  }, [
    data.missingDependencies,
    setCurrApp,
    index,
    versions,
    defaultProviders,
    navigate,
  ]);

  const updateLabel = useMemo(
    () =>
      data.missingDependencies.length
        ? translations["View dependency"]
        : translations["View updates"],
    [data.missingDependencies.length, translations]
  );

  const handleDismiss = useCallback(() => {
    addSessionProp("updatesBannerDismissed", currApp.name);
  }, [addSessionProp, currApp.name]);

  return (
    <Banner
      visible={message !== null}
      actions={[
        {
          label: translations["Dismiss"],
          onPress: handleDismiss,
        },
        {
          label: updateLabel,
          onPress: handleUpdate,
        },
      ]}
    >
      {message}
    </Banner>
  );
}
