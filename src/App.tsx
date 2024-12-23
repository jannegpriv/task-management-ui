import { Container, Grid, Paper, Box, IconButton, useMediaQuery, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useState, useMemo, useEffect } from 'react';
import { api } from './services/api';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#90caf9' : '#1976d2',
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#f5f5f5',
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
        },
      }),
    [mode]
  );

  const toggleColorMode = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    try {
      await api.updateSettings({ dark_mode: newMode === 'dark' });
    } catch (error) {
      console.error('Failed to update settings:', error);
      // Revert the mode if the API call fails
      setMode(mode);
    }
  };

  const handleTaskCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          bgcolor: mode === 'dark' ? '#121212' : '#f5f5f5'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton 
              onClick={toggleColorMode} 
              color="inherit" 
              sx={{ 
                ml: 1,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'rotate(180deg)',
                },
              }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
          
          <Grid container spacing={3}>
            {/* Task Creation Form - Left Column */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  bgcolor: 'background.paper',
                  transition: 'background-color 0.3s ease'
                }}
              >
                <TaskForm onTaskCreated={handleTaskCreated} />
              </Paper>
            </Grid>

            {/* Task List - Right Column */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  bgcolor: 'background.paper',
                  transition: 'background-color 0.3s ease'
                }}
              >
                <TaskList key={refreshTrigger} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
