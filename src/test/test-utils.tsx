import React from 'react';
import { render as rtlRender } from '@testing-library/react';
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

// Export our custom render method
export { render };

// Re-export testing utilities
export type { RenderResult } from '@testing-library/react';
export { screen, fireEvent, waitFor } from '@testing-library/react';
