import { createContext } from "react";

export enum Theme {
    LIGHT = "light",
    DARK = "dark",
    SYSTEM = "system",
}

export interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const ThemeContext =
    createContext<
        ThemeContextValue | undefined
    >(undefined);