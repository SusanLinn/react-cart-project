import {
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    Theme,
    ThemeContext,
} from "../context/theme-context";

interface ThemeProviderProps {
    children: ReactNode;
}

const THEME_KEY_PREFIX =
    "products-cart-theme-user";

const getThemeKey = (
    userId: string
) => {
    return `${THEME_KEY_PREFIX}-${userId}`;
};

const getSystemTheme = (): Theme => {
    return window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches
        ? Theme.DARK
        : Theme.LIGHT;
};

const getInitialTheme = (): Theme => {
    const userId =
        localStorage.getItem("userId");

    // Not logged in
    // Default = System
    if (!userId) {
        return Theme.SYSTEM;
    }

    const savedTheme =
        localStorage.getItem(
            getThemeKey(userId)
        );

    // Existing user has saved preference
    if (
        savedTheme === Theme.LIGHT ||
        savedTheme === Theme.DARK ||
        savedTheme === Theme.SYSTEM
    ) {
        return savedTheme;
    }

    // New logged-in user
    // Default = System
    return Theme.SYSTEM;
};

const ThemeProvider = ({
    children,
}: ThemeProviderProps) => {
    const [theme, setThemeState] =
        useState<Theme>(
            getInitialTheme
        );

    useEffect(() => {
        const root =
            document.documentElement;

        const appliedTheme =
            theme === Theme.SYSTEM
                ? getSystemTheme()
                : theme;

        root.classList.toggle(
            "dark",
            appliedTheme === Theme.DARK
        );
    }, [theme]);

    useEffect(() => {
        const mediaQuery =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            );

        const handleSystemThemeChange =
            () => {
                if (
                    theme !==
                    Theme.SYSTEM
                ) {
                    return;
                }

                const root =
                    document.documentElement;

                const systemTheme =
                    getSystemTheme();

                root.classList.toggle(
                    "dark",
                    systemTheme ===
                        Theme.DARK
                );
            };

        mediaQuery.addEventListener(
            "change",
            handleSystemThemeChange
        );

        return () => {
            mediaQuery.removeEventListener(
                "change",
                handleSystemThemeChange
            );
        };
    }, [theme]);

    useEffect(() => {
        const handleThemeUserChanged =
            () => {
                setThemeState(
                    getInitialTheme()
                );
            };

        window.addEventListener(
            "theme-user-changed",
            handleThemeUserChanged
        );

        return () => {
            window.removeEventListener(
                "theme-user-changed",
                handleThemeUserChanged
            );
        };
    }, []);

    const setTheme = (
        newTheme: Theme
    ) => {
        const userId =
            localStorage.getItem(
                "userId"
            );

        if (userId) {
            localStorage.setItem(
                getThemeKey(userId),
                newTheme
            );
        }

        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;