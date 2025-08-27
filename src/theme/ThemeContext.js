import { createContext, useState, useContext, useEffect } from 'react';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { LightTheme } from './lightScheme';
import { DarkTheme } from './darkScheme';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme(); // Get system theme
  // const [themeMode, setThemeMode] = useState(systemColorScheme || 'light');
  const [themeMode, setThemeMode] = useState('light');

  // Load stored theme from AsyncStorage
  useEffect(() => {
    const loadStoredTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('appTheme');
        if (storedTheme) {
          setThemeMode(storedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };
    loadStoredTheme();
  }, []);

  // Sync theme with system changes if no stored theme
  useEffect(() => {
    if (!themeMode) {
      setThemeMode(systemColorScheme || 'light');
    }
  }, [systemColorScheme]);

  const toggleTheme = async (theme) => {
    try {
      await AsyncStorage.setItem('appTheme', theme);
      setThemeMode(theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const theme =
    themeMode === 'dark'
      ? { ...MD3DarkTheme, colors: DarkTheme }
      : { ...MD3LightTheme, colors: LightTheme };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeMode }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
