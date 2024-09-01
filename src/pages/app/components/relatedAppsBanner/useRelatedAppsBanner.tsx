import * as React from "react";
import { CurrAppProps } from "@/hooks/useCurrApp";
import { Translation } from "@/types/translations";
import { useVersions } from "@/states/computed/versions";
import { useUpdates } from "@/states/computed/updates";
import { interpolate, useTranslations } from "@/states/persistent/translations";
import { useSession } from "@/states/runtime/session";

const BannerAppsKeys = [
  "missingDependencies",
  "outdatedDependencies",
  "outdatedComplementaryApps",
] as const;

type BannerAppKey = (typeof BannerAppsKeys)[number];

const Messages: Record<
  BannerAppKey,
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

type BannerData = Record<BannerAppKey, string[]>;

function generateMessage(
  data: BannerData,
  appsDismissed: string[],
  translations: Record<string, string>,
  currAppTitle: string
): string | null {
  if (appsDismissed.includes(currAppTitle)) return null;

  for (const key of BannerAppsKeys) {
    const apps = data[key].filter((app) => !appsDismissed.includes(app));
    if (apps.length === 0) continue;

    const messageKey = apps.length === 1 ? "singular" : "plural";
    const message =
      translations[Messages[key][messageKey]] || Messages[key][messageKey];

    return apps.length === 1
      ? interpolate(message, apps[0])
      : interpolate(message, apps.slice(0, -1).join(", "), apps.slice(-1)[0]);
  }

  return null;
}

export function useRelatedAppsBanner(currApp: CurrAppProps): {
  message: string | null;
  data: BannerData;
} {
  const versions = useVersions((state) => state.versions);
  const updates = useUpdates((state) => state.updates);
  const appsDismissed = useSession(
    (state) => state.trackers.appsBannerDismissed
  );
  const translations = useTranslations((state) => state.translations);

  const data: BannerData = React.useMemo(
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

  const message = React.useMemo(
    () => generateMessage(data, appsDismissed, translations, currApp.title),
    [data, appsDismissed, translations, currApp.title]
  );

  return { message, data };
}
