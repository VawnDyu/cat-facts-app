import { useState, useEffect, useRef } from 'react';
import { getTheme } from '../utils/theme';
import { loadTheme, saveTheme } from '../utils/storage';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => loadTheme());
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    saveTheme(isDark);
  }, [isDark]);

  const theme = getTheme(isDark);
  const toggleTheme = () => setIsDark(!isDark);

  return { theme, isDark, toggleTheme };
};