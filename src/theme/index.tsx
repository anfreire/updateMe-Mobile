import * as React from 'react';
import {useColorScheme} from 'react-native';
import {
  Material3Theme,
  Material3Scheme,
  useMaterial3Theme,
} from '@pchmn/expo-material3-theme';
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
  ProviderProps,
} from 'react-native-paper';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import merge from 'deepmerge';
import {useSettings} from '@/states/persistent/settings';

export type ColorSchemeType = 'light' | 'dark';
export type SavedColorSchemeType = 'system' | ColorSchemeType;

type useThemeState = {
  theme: Material3Theme;
  colorScheme: ColorSchemeType;
  schemedTheme: Material3Scheme;
  sourceColor: string;
};

type useThemeActions = {
  setSourceColor: (sourceColor: string) => void;
  setColorScheme: (colorScheme: SavedColorSchemeType) => void;
  resetSourceColor: () => void;
  updateTheme: (sourceColor: string) => void;
  resetTheme: () => void;
};

export type UseThemeProps = useThemeState & useThemeActions;

const ThemeContext = React.createContext<UseThemeProps | undefined>(undefined);

type ThemeProviderProps = ProviderProps & {
  sourceColor?: string;
  fallbackSourceColor?: string;
};

const ThemeProvider = ({
  children,
  fallbackSourceColor,
  ...otherProps
}: ThemeProviderProps) => {
  const systemColorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const {colorScheme: rawColorScheme, sourceColor} = useSettings(state => ({
    colorScheme: state.settings.appearance.colorScheme,
    sourceColor: state.settings.appearance.sourceColor,
  }));
  const {setSetting, resetSetting} = useSettings();
  const {theme, updateTheme, resetTheme} = useMaterial3Theme({
    sourceColor: sourceColor,
    fallbackSourceColor,
  });

  const colorScheme = React.useMemo(
    () => (rawColorScheme === 'system' ? systemColorScheme : rawColorScheme),
    [rawColorScheme, systemColorScheme],
  );

  const derivedThemes = React.useMemo(
    () => ({
      combinedTheme:
        colorScheme === 'dark'
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
    [theme, colorScheme],
  );

  const setSourceColor = React.useCallback(
    (color: string) => {
      setSetting('appearance', 'sourceColor', color);
      updateTheme(color);
    },
    [updateTheme],
  );

  const setColorScheme = React.useCallback(
    (newColorScheme: SavedColorSchemeType) => {
      setSetting('appearance', 'colorScheme', newColorScheme);
    },
    [],
  );

  const resetSourceColor = React.useCallback(() => {
    resetTheme();
    resetSetting('appearance', 'sourceColor');
  }, [resetTheme]);

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
    ],
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

ThemeProvider.displayName = 'ThemeProvider';

export default ThemeProvider;

export const useTheme = (): UseThemeProps => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
