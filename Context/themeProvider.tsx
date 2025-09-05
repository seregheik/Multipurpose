import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

// Define theme types
type Theme = 'light' | 'dark';

// Define context value type
interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider props type
interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
}

// Theme Provider Component
export const ThemeProvider = ({ children, defaultTheme = 'dark' }: ThemeProviderProps) => {
    const [theme, setThemeState] = useState<Theme>(defaultTheme);

    // Initialize theme on mount
    useEffect(() => {
        // Get theme from localStorage or use default
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            setThemeState(savedTheme);
        } else {
            // Check system preference if no saved theme
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = prefersDark ? 'dark' : defaultTheme;
            setThemeState(initialTheme);
            localStorage.setItem('theme', initialTheme);
        }
    }, [defaultTheme]);

    // Apply theme to document when it changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Memoized theme setter
    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
    }, []);

    // Memoized theme toggler
    const toggleTheme = useCallback(() => {
        setThemeState(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    }, []);

    // Computed value for isDark
    const isDark = theme === 'dark';

    const contextValue: ThemeContextType = {
        theme,
        isDark,
        toggleTheme,
        setTheme
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};

// HOC for components that need theme
export const withTheme = <P extends object>(
    Component: React.ComponentType<P & { theme: ThemeContextType }>
) => {
    return (props: P) => {
        const theme = useTheme();
        return <Component {...props} theme={theme} />;
    };
};