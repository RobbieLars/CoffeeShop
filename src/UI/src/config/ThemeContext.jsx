import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState
} from 'react';

const THEMES = Object.freeze({
    LIGHT: 'light',
    DARK: 'dark'
});

const THEME_STORAGE_KEY = 'coffeeshop.ui.theme';
const DEFAULT_THEME = THEMES.DARK;

const ThemeContext = createContext(null);

function isSupportedTheme(theme) {
    return Object.values(THEMES).includes(theme);
}

function readStoredTheme() {
    if (typeof window === 'undefined') {
        return DEFAULT_THEME;
    }

    try {
        const storedTheme = window.localStorage.getItem(
            THEME_STORAGE_KEY
        );

        return isSupportedTheme(storedTheme)
            ? storedTheme
            : DEFAULT_THEME;
    } catch {
        return DEFAULT_THEME;
    }
}

function persistTheme(theme) {
    try {
        window.localStorage.setItem(
            THEME_STORAGE_KEY,
            theme
        );
    } catch {
        // La aplicación puede seguir usando el tema durante la sesión
        // aunque el navegador no permita utilizar localStorage.
    }
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
}

function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(readStoredTheme);

    useLayoutEffect(() => {
        applyTheme(theme);
        persistTheme(theme);
    }, [theme]);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (
                event.key === THEME_STORAGE_KEY &&
                isSupportedTheme(event.newValue)
            ) {
                setThemeState(event.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener(
                'storage',
                handleStorageChange
            );
        };
    }, []);

    const setTheme = useCallback((nextTheme) => {
        if (!isSupportedTheme(nextTheme)) {
            throw new Error(
                `El tema "${nextTheme}" no está registrado.`
            );
        }

        setThemeState(nextTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((currentTheme) =>
            currentTheme === THEMES.DARK
                ? THEMES.LIGHT
                : THEMES.DARK
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

function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            'useTheme debe utilizarse dentro de ThemeProvider.'
        );
    }

    return context;
}

export {
    DEFAULT_THEME,
    THEMES,
    THEME_STORAGE_KEY,
    ThemeProvider,
    useTheme
};

export default ThemeContext;
