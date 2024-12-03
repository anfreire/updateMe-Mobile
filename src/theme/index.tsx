import React from 'react';
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
import {createContext, useCallback, useContext, useMemo} from 'react';
import {useShallow} from 'zustand/shallow';
import {useSettings} from '@/stores/persistent/settings';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

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

/******************************************************************************
 *                                  CONTEXT                                   *
 ******************************************************************************/

const ThemeContext = createContext<UseThemeProps | undefined>(undefined);

/******************************************************************************
 *                                  PROVIDER                                  *
 ******************************************************************************/

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
  const [rawColorScheme, sourceColor, setSettingWithPrevious, resetSetting] =
    useSettings(
      useShallow(state => [
        state.settings.appearance.colorScheme,
        state.settings.appearance.sourceColor,
        state.setSettingWithPrevious,
        state.resetSetting,
      ]),
    );
  const {theme, updateTheme, resetTheme} = useMaterial3Theme({
    sourceColor: sourceColor,
    fallbackSourceColor,
  });

  const colorScheme = useMemo(
    () => (rawColorScheme === 'system' ? systemColorScheme : rawColorScheme),
    [rawColorScheme, systemColorScheme],
  );

  const derivedThemes = useMemo(
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

  const setSourceColor = useCallback(
    (color: string) => {
      setSettingWithPrevious('appearance', 'sourceColor', prevSourceColor => {
        if (prevSourceColor === color) {
          return prevSourceColor;
        }
        updateTheme(color);
        return color;
      });
    },
    [updateTheme],
  );

  const setColorScheme = useCallback((newColorScheme: SavedColorSchemeType) => {
    setSettingWithPrevious('appearance', 'colorScheme', prevColorScheme => {
      if (prevColorScheme === newColorScheme) {
        return prevColorScheme;
      }
      return newColorScheme;
    });
  }, []);

  const resetSourceColor = useCallback(() => {
    resetTheme();
    resetSetting('appearance', 'sourceColor');
  }, [resetTheme]);

  const contextValue = useMemo(
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

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

const useTheme = (): UseThemeProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default ThemeProvider;

export {useTheme};
