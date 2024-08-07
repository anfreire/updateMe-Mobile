import AppsModule from "@/lib/apps";
import { useDefaultProviders } from "@/states/persistent/defaultProviders";
import { AppProps, useIndex } from "@/states/temporary";
import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { Logger } from "@/states/persistent/logs";

export interface CurrAppProps extends AppProps {
    name: string;
    version: string | null;
    defaultProvider: string;
}

export interface UseComputedProps {
    currApp: CurrAppProps | null;
    setCurrApp: (appName: string | null) => void;
    localVersions: Record<string, string | null>;
    refreshLocalVersions: () => Promise<void>;
    updates: string[];
}

const ComputedContext = createContext<UseComputedProps | undefined>(undefined);

const getDefaultProvider = (appName: string, index: Record<string, AppProps>, defaultProviders: Record<string, string>): string => {
    return defaultProviders[appName] || Object.keys(index[appName].providers)[0];
};

const isUpdateAvailable = (localVersion: string | null, remoteVersion: string): boolean => {
    return localVersion !== null && localVersion < remoteVersion;
};

export function ComputedProvider({ children }: { children: React.ReactNode }) {
    const [currAppName, setCurrAppName] = React.useState<string | null>(null);
    const [localVersions, setLocalVersions] = React.useState<Record<string, string | null>>({});
    const index = useIndex((state) => state.index);
    const defaultProviders = useDefaultProviders((state) => state.defaultProviders);

    const refreshLocalVersions = useCallback(async () => {
        try {
            const newLocalVersions = await Promise.all(
                Object.entries(index).map(async ([appName, app]) => {
                    const defaultProvider = getDefaultProvider(appName, index, defaultProviders);
                    try {
                        const version = await AppsModule.getAppVersion(
                            app.providers[defaultProvider].packageName
                        );
                        return [appName, version] as [string, string | null];
                    } catch (error) {
                        Logger.error(`Error getting local version for ${appName}: ${error}`);
                        return [appName, null] as [string, null];
                    }
                })
            );
            setLocalVersions(Object.fromEntries(newLocalVersions));
        } catch (error) {
            Logger.error(`Error getting local versions: ${error}`);
        }
    }, [index, defaultProviders]);

    const updates = useMemo(() => {
        return Object.entries(index).reduce((acc, [appName, app]) => {
            const defaultProvider = getDefaultProvider(appName, index, defaultProviders);
            const localVersion = localVersions[appName];
            const remoteVersion = app.providers[defaultProvider].version;
            if (isUpdateAvailable(localVersion, remoteVersion)) {
                acc.push(appName);
            }
            return acc;
        }, [] as string[]);
    }, [index, localVersions, defaultProviders]);

    const setCurrApp = useCallback((appName: string | null) => {
        setCurrAppName(appName);
    }, []);

    const currApp = useMemo((): CurrAppProps | null => {
        if (currAppName === null || !index[currAppName]) return null;
        const defaultProvider = getDefaultProvider(currAppName, index, defaultProviders);
        return {
            ...index[currAppName],
            name: currAppName,
            version: index[currAppName].providers[defaultProvider].version,
            defaultProvider,
        };
    }, [currAppName, index, defaultProviders]);

    const value = useMemo(
        () => ({ currApp, setCurrApp, localVersions, refreshLocalVersions, updates }),
        [currApp, setCurrApp, updates, localVersions, refreshLocalVersions]
    );

    useEffect(() => {
        refreshLocalVersions();
    }, [refreshLocalVersions]);

    return (
        <ComputedContext.Provider value={value}>
            {children}
        </ComputedContext.Provider>
    );
}

export function useComputed() {
    const context = useContext(ComputedContext);
    if (!context) {
        throw new Error("useComputed must be used within a ComputedProvider");
    }
    return context;
}