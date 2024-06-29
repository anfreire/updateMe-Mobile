import {
  Material3Theme,
  Material3Scheme,
  useMaterial3Theme,
} from '@pchmn/expo-material3-theme';
import {createContext, useContext} from 'react';
import {useColorScheme} from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
  ProviderProps,
} from 'react-native-paper';
import merge from 'deepmerge';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {useSettings} from '../states/persistent/settings';

export type ColorSchemeType = 'light' | 'dark';

export type SavedColorSchemeType = 'system' | ColorSchemeType;

export type useThemeProps = {
  theme: Material3Theme;
  colorScheme: 'light' | 'dark';
  schemedTheme: Material3Scheme;
  sourceColor: string;
  setSourceColor: (sourceColor: string) => void;
  setColorScheme: (colorScheme: SavedColorSchemeType) => void;
  resetSourceColor: () => void;
  updateTheme: (sourceColor: string) => void;
  resetTheme: () => void;
};

export const ThemeContext = createContext<useThemeProps>({} as useThemeProps);

export function ThemeProvider({
  children,
  fallbackSourceColor,
  ...otherProps
}: ProviderProps & {sourceColor?: string; fallbackSourceColor?: string}) {
  const systemColorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const {colorScheme: rawColorScheme, sourceColor} = useSettings(state => ({
    colorScheme: state.settings.theme.colorScheme,
    sourceColor: state.settings.theme.sourceColor,
  }));
  const {setSetting, resetSetting} = useSettings();
  const {theme, updateTheme, resetTheme} = useMaterial3Theme({
    sourceColor: sourceColor ?? undefined,
    fallbackSourceColor,
  });

  const colorScheme =
    rawColorScheme == 'system' ? systemColorScheme : rawColorScheme;
  const combinedTheme =
    colorScheme === 'dark'
      ? merge(NavigationDarkTheme, {
          ...MD3DarkTheme,
          colors: theme.dark,
        })
      : merge(NavigationDefaultTheme, {
          ...MD3LightTheme,
          colors: theme.light,
        });

  const setSourceColor = (color: string) => {
    setSetting('theme', 'sourceColor', color);
    updateTheme(color);
  };

  const setColorScheme = (colorScheme: SavedColorSchemeType) => {
    setSetting('theme', 'colorScheme', colorScheme);
  };

  const schemedTheme = theme[colorScheme];

  const resetSourceColor = () => {
    resetTheme();
    resetSetting('theme', 'sourceColor');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme: colorScheme,
        schemedTheme,
        sourceColor: schemedTheme.primary,
        setSourceColor,
        setColorScheme,
        resetSourceColor,
        updateTheme,
        resetTheme,
      }}>
      <PaperProvider theme={combinedTheme} {...otherProps}>
        <NavigationContainer theme={combinedTheme}>
          {children}
        </NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
