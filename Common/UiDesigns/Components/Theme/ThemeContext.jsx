import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState
} from "react";

export const THEMES = Object.freeze({
    LIGHT: "light",
    DARK: "dark"
});

export const DEFAULT_STORAGE_KEY = "common-ui.theme";
export const DEFAULT_THEME = THEMES.DARK;

export const ThemeContext = createContext(null);

function isSupportedTheme(theme) {
    return Object.values(THEMES).includes(theme);
}

function readStoredTheme(storageKey, defaultTheme) {
    if (typeof window === "undefined") {
        return defaultTheme;
    }

    try {
        const storedTheme = window.localStorage.getItem(storageKey);
        return isSupportedTheme(storedTheme) ? storedTheme : defaultTheme;
    } catch {
        return defaultTheme;
    }
}

function persistTheme(storageKey, theme) {
    try {
        window.localStorage.setItem(storageKey, theme);
    } catch {
        // La aplicación puede seguir utilizando el tema durante la sesión
    }
}

function applyTheme(theme) {
    if (typeof document !== "undefined" && document.documentElement) {
        document.documentElement.dataset.theme = theme;
    }
}

export function ThemeProvider({
    children,
    defaultTheme = DEFAULT_THEME,
    storageKey = DEFAULT_STORAGE_KEY
}) {
    const [theme, setThemeState] = useState(() =>
        readStoredTheme(storageKey, defaultTheme)
    );

    useLayoutEffect(() => {
        applyTheme(theme);
        persistTheme(storageKey, theme);
    }, [theme, storageKey]);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (
                event.key === storageKey &&
                isSupportedTheme(event.newValue)
            ) {
                setThemeState(event.newValue);
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [storageKey]);

    const setTheme = useCallback((nextTheme) => {
        if (!isSupportedTheme(nextTheme)) {
            throw new Error(`El tema "${nextTheme}" no está soportado.`);
        }
        setThemeState(nextTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((current) =>
            current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
        );
    }, []);

    const contextValue = useMemo(() => ({
        theme,
        isDark: theme === THEMES.DARK,
        setTheme,
        toggleTheme
    }), [theme, setTheme, toggleTheme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme debe utilizarse dentro de un ThemeProvider.");
    }
    return context;
}

export function useOptionalTheme() {
    return useContext(ThemeContext);
}

export default ThemeContext;