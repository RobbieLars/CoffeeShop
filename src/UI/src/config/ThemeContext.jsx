// ThemeContext para CoffeeShop
// Re-exporta y delega la gestión al módulo reusable de @common-ui

import React from 'react';
import {
    ThemeProvider as CommonThemeProvider,
    useTheme as useCommonTheme,
    useOptionalTheme as useCommonOptionalTheme,
    THEMES,
    DEFAULT_THEME
} from '@common-ui';

const THEME_STORAGE_KEY = 'coffeeshop.ui.theme';

function ThemeProvider({
    children,
    defaultTheme = DEFAULT_THEME,
    storageKey = THEME_STORAGE_KEY
}) {
    return (
        <CommonThemeProvider
            defaultTheme={defaultTheme}
            storageKey={storageKey}
        >
            {children}
        </CommonThemeProvider>
    );
}

export {
    DEFAULT_THEME,
    THEMES,
    THEME_STORAGE_KEY,
    ThemeProvider,
    useCommonTheme as useTheme,
    useCommonOptionalTheme as useOptionalTheme
};

export default ThemeProvider;
