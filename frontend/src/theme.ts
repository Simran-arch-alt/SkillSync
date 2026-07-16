import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#119DA4' },
    secondary: { main: '#84B74E' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    text: { primary: '#0F172A', secondary: '#64748B' },
    divider: '#E2E8F0',
    success: { main: '#84B74E' },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h1: { fontWeight: 800, fontSize: 'clamp(2.8rem, 5vw, 4rem)', lineHeight: 1.2 },
    h2: { fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.5rem)', letterSpacing: '-0.02em' },
    h5: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F8FAFC',
          color: '#0F172A',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 60,
          padding: '10px 28px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
          },
          '&.MuiButton-containedPrimary': {
            backgroundColor: '#119DA4',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#19647E',
            },
          },
          '&.MuiButton-outlinedPrimary': {
            borderColor: '#119DA4',
            color: '#119DA4',
            '&:hover': {
              borderColor: '#19647E',
              backgroundColor: 'rgba(17, 157, 164, 0.06)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 24,
          transition: 'transform 0.25s, box-shadow 0.25s',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 35px -10px rgba(0,0,0,0.15)',
          },
        },
      },
    },
  },
});