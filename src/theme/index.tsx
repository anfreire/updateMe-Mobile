import * as React from "react";
import { useColorScheme } from "react-native";
import {
  Material3Theme,
  Material3Scheme,
  useMaterial3Theme,
} from "@pchmn/expo-material3-theme";
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
  ProviderProps,
} from "react-native-paper";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import merge from "deepmerge";
import { useSettings } from "@/states/persistent/settings";

export type ColorSchemeType = "light" | "dark";
export type SavedColorSchemeType = "system" | ColorSchemeType;

export type UseThemeProps = {
  theme: Material3Theme;
  colorScheme: ColorSchemeType;
  schemedTheme: Material3Scheme;
  sourceColor: string;
  setSourceColor: (sourceColor: string) => void;
  setColorScheme: (colorScheme: SavedColorSchemeType) => void;
  resetSourceColor: () => void;
  updateTheme: (sourceColor: string) => void;
  resetTheme: () => void;
};

const ThemeContext = createContext<UseThemeProps | undefined>(undefined);

type ThemeProviderProps = ProviderProps & {
  sourceColor?: string;
  fallbackSourceColor?: string;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  fallbackSourceColor,
  ...otherProps
}) => {
  const systemColorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const { colorScheme: rawColorScheme, sourceColor } = useSettings((state) => ({
    colorScheme: state.settings.theme.colorScheme,
    sourceColor: state.settings.theme.sourceColor,
  }));
  const { setSetting, resetSetting } = useSettings();
  const { theme, updateTheme, resetTheme } = React.useMemo(
    () =>
      useMaterial3Theme({
        sourceColor: sourceColor ?? undefined,
        fallbackSourceColor,
      }),
    [sourceColor, fallbackSourceColor]
  );

  const colorScheme = React.useMemo(
    () => (rawColorScheme === "system" ? systemColorScheme : rawColorScheme),
    [rawColorScheme, systemColorScheme]
  );

  const derivedThemes = React.useMemo(
    () => ({
      combinedTheme:
        colorScheme === "dark"
          ? merge(NavigationDarkTheme, {
              ...MD3DarkTheme,
              colors: theme.dark,
            })
          : merge(NavigationDefaultTheme, {
              ...MD3LightTheme,
              colors: theme.light,
            }),
      schemedTheme: theme[colorScheme],
    }),
    [theme, colorScheme]
  );

  const setSourceColor = React.useCallback(
    (color: string) => {
      setSetting("theme", "sourceColor", color);
      updateTheme(color);
    },
    [setSetting, updateTheme]
  );

  const setColorScheme = React.useCallback(
    (newColorScheme: SavedColorSchemeType) => {
      setSetting("theme", "colorScheme", newColorScheme);
    },
    [setSetting]
  );

  const resetSourceColor = React.useCallback(() => {
    resetTheme();
    resetSetting("theme", "sourceColor");
  }, [resetTheme, resetSetting]);

  const contextValue = React.useMemo(
    () => ({
      theme,
      colorScheme,
      schemedTheme: derivedThemes.schemedTheme,
      sourceColor: derivedThemes.schemedTheme.primary,
      setSourceColor,
      setColorScheme,
      resetSourceColor,
      updateTheme,
      resetTheme,
    }),
    [
      theme,
      colorScheme,
      derivedThemes,
      setSourceColor,
      setColorScheme,
      resetSourceColor,
      updateTheme,
      resetTheme,
    ]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <PaperProvider theme={derivedThemes.combinedTheme} {...otherProps}>
        <NavigationContainer theme={derivedThemes.combinedTheme}>
          {children}
        </NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): UseThemeProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
