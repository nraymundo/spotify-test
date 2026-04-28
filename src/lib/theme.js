import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tokensLight, tokensDark } from "./tokens";

const STORAGE_KEY = "app:themeMode";
const ThemeContext = createContext(null);

export const THEME_MODES = ["light", "dark", "system"];

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (THEME_MODES.includes(stored)) setMode(stored);
      })
      .catch(() => {});
  }, []);

  function changeMode(next) {
    if (!THEME_MODES.includes(next)) return;
    setMode(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }

  const scheme = mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;
  const tokens = scheme === "dark" ? tokensDark : tokensLight;

  const value = useMemo(
    () => ({ tokens, scheme, mode, setMode: changeMode }),
    [tokens, scheme, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTokens() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTokens must be used within a ThemeProvider");
  return ctx.tokens;
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used within a ThemeProvider");
  return { mode: ctx.mode, setMode: ctx.setMode, scheme: ctx.scheme };
}
