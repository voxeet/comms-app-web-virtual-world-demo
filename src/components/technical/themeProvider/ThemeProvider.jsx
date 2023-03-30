import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext(null);

const ThemeProvider = ({ children, theme }) => {
  const [colorMode, rawSetColorMode] = useState("light");

  const setColorMode = () => {
    rawSetColorMode(colorMode === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const applyColorMode = (variant = "dark") => {
      Object.entries(theme.colors[variant]).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    };

    applyColorMode(colorMode);
  }, [colorMode, theme]);

  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
