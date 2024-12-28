import { Container, Grid, Paper, Box, IconButton, useMediaQuery, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useState, useMemo, useEffect } from 'react';
import { api } from './services/api';
import { StyledEngineProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const cache = createCache({
  key: 'css',
  prepend: true,
});

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await api.getSettings();
        setMode(settings.dark_mode ? 'dark' : 'light');
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleThemeChange = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    try {
      await api.updateSettings({ dark_mode: newMode === 'dark' });
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <CacheProvider value={cache}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={handleThemeChange} color="inherit">
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Paper>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ position: 'sticky', top: 0 }}>
                    <TaskForm setRefreshTrigger={setRefreshTrigger} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TaskList refreshTrigger={refreshTrigger} />
                </Grid>
              </Grid>
            </Box>
          </Container>
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
}

export default App;
