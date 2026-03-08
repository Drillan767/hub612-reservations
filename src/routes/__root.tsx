import { createRootRoute, Outlet } from '@tanstack/react-router'
import Navbar from '../components/layout/Navbar' 
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Switzer from '../assets/fonts/Switzer-Variable.woff2'

const theme = createTheme({
    typography: {
        fontFamily: 'Switzer, sans-serif'
    },
    palette: {
        primary: {
            main: '#c00100',
            light: '#ffdad4',     // primary-container
            dark: '#930100',      // on-primary-fixed-variant
            contrastText: '#ffffff', // on-primary
        },
        secondary: {
            main: '#b72114',
            light: '#ffdad4',     // secondary-container
            dark: '#930100',      // on-secondary-fixed-variant
            contrastText: '#ffffff', // on-secondary
        },
        error: {
            main: '#ba1a1a',
            light: '#ffdad6',     // error-container
            contrastText: '#ffffff', // on-error
        },
        background: {
            default: '#fff8f6',   // background
            paper: '#fff8f6',     // surface
        },
        text: {
            primary: '#1e1b1a',   // on-surface
            secondary: '#504442', // on-surface-variant
        },
        divider: '#827472',       // outline
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                @font-face {
                    font-family: 'Switzer';
                    font-style: normal;
                    font-display: swap;
                    font-weight: 400;
                    src: local('Switzer'), local('Switzer-Variable'), url(${Switzer}) format('woff2');
                    unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
                }
            `,
        }
    }
})

const RootLayout = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Outlet />
    </ThemeProvider>
)

export const Route = createRootRoute({ component: RootLayout })