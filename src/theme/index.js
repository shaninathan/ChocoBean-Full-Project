import { createTheme } from '@mui/material/styles';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

// יצירת cache עבור RTL
export const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// יצירת theme עם צבעי חום/קרם ו-RTL
export const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#8B4513', // חום כהה למסגרות וטקסטים
      light: '#A0522D',
      dark: '#654321',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFF3DA', // קרם עדין
      light: '#FFEAC2',
      dark: '#FFE0A3',
      contrastText: '#8B4513',
    },
    background: {
      default: '#FEF9F0',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2F1B14',
      secondary: '#5D4037',
    },
    error: {
      main: '#D32F2F',
    },
    success: {
      main: '#388E3C',
    },
    warning: {
      main: '#F57C00',
    },
    info: {
      main: '#1976D2',
    },
  },
  typography: {
    fontFamily: [
      'Segoe UI',
      'Tahoma',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: { fontSize: '2.5rem', fontWeight: 600, color: '#2F1B14' },
    h2: { fontSize: '2rem', fontWeight: 600, color: '#2F1B14' },
    h3: { fontSize: '1.75rem', fontWeight: 600, color: '#2F1B14' },
    h4: { fontSize: '1.5rem', fontWeight: 500, color: '#2F1B14' },
    h5: { fontSize: '1.25rem', fontWeight: 500, color: '#2F1B14' },
    h6: { fontSize: '1rem', fontWeight: 500, color: '#2F1B14' },
    body1: { fontSize: '1rem', color: '#5D4037' },
    body2: { fontSize: '0.875rem', color: '#5D4037' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { variant: 'contained', color: 'primary' },
      styleOverrides: {
        root: {
          borderRadius: 25,
          padding: '10px 20px',
          fontSize: '0.95rem',
          fontWeight: 600,
          transition: 'all 0.25s ease',
        },
        contained: {
          color: '#8B4513',
          background: 'linear-gradient(145deg, #FFF3DA 0%, #FFE5B4 100%)',
          boxShadow: '0 4px 12px rgba(139, 69, 19, 0.18)',
          '&:hover': {
            background: 'linear-gradient(145deg, #FFEAC2 0%, #FFDFA6 100%)',
            boxShadow: '0 6px 18px rgba(139, 69, 19, 0.24)'
          },
        },
        outlined: {
          color: '#8B4513',
          borderWidth: '2px',
          borderColor: '#8B4513',
          '&:hover': { borderWidth: '2px', backgroundColor: 'rgba(139,69,19,0.06)' },
        },
        text: {
          color: '#8B4513',
          '&:hover': { backgroundColor: 'transparent' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'linear-gradient(145deg, #FFF8E1 0%, #FEF9F0 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(139, 69, 19, 0.18)',
          boxShadow: '0 4px 20px rgba(139, 69, 19, 0.12)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 10px 32px rgba(139, 69, 19, 0.22)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255, 248, 225, 0.9)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(139, 69, 19, 0.18)',
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8B4513', borderWidth: '2px' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8B4513', borderWidth: '2px' },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: { root: { backgroundColor: 'transparent', color: '#8B4513', boxShadow: 'none', borderBottom: 'none' } },
    },
    MuiDrawer: {
      styleOverrides: { paper: { backgroundColor: '#FEF9F0', borderLeft: '1px solid rgba(139, 69, 19, 0.12)' } },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&:hover': { backgroundColor: 'rgba(139, 69, 19, 0.08)' },
          '&.Mui-selected': { backgroundColor: 'rgba(139, 69, 19, 0.12)', '&:hover': { backgroundColor: 'rgba(139, 69, 19, 0.16)' } },
        },
      },
    },
  },
});

export default theme;
