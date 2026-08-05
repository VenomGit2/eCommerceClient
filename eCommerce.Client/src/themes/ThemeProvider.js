import { createContext, useContext } from 'react';
import defaultTheme from './defaultTheme';

const ThemeContext = createContext(defaultTheme);
export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
  return <ThemeContext.Provider value={defaultTheme}>{children}</ThemeContext.Provider>;
}

