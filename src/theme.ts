import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Define a custom dark theme with premium colors and Inter font
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9', // light blue
        },
        secondary: {
            main: '#f48fb1', // pink
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
    },
    components: {
        // Add smooth transitions for all MUI components
        MuiCssBaseline: {
            styleOverrides: {
                '*': {
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                },
            },
        },
    },
});

export default theme;
