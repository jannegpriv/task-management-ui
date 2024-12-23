import React from 'react';
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { StyledEngineProvider } from '@mui/material/styles';

const cache = createCache({
  key: 'css',
  prepend: true,
});

function render(ui: React.ReactElement, { theme = createTheme(), ...options } = {}) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <CacheProvider value={cache}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Export commonly used testing utilities
export { screen, fireEvent, waitFor } from '@testing-library/react';

// Export our custom render method
export { render };
