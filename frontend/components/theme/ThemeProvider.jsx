"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [colorMode, setColorMode] = useState("blue");
  const [mounted, setMounted] = useState(false);

  // Load saved settings
  useEffect(() => {
    const savedTheme = localStorage.getItem("taskora-theme");
    const savedColor = localStorage.getItem("taskora-color");

    if (
      savedTheme === "light" ||
      savedTheme === "dark"
    ) {
      setTheme(savedTheme);
    }

    if (savedColor) {
      setColorMode(savedColor);
    }

    setMounted(true);
  }, []);

  // Apply theme and color to the document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Theme
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Keep data attributes for our custom theme system
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-color", colorMode);

    // Save settings
    localStorage.setItem("taskora-theme", theme);
    localStorage.setItem("taskora-color", colorMode);
  }, [theme, colorMode, mounted]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light"
        ? "dark"
        : "light"
    );
  };

  const changeTheme = (newTheme) => {
    if (
      newTheme !== "light" &&
      newTheme !== "dark"
    ) {
      return;
    }

    setTheme(newTheme);
  };

  const changeColorMode = (newColor) => {
    setColorMode(newColor);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorMode,
        toggleTheme,
        changeTheme,
        changeColorMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}