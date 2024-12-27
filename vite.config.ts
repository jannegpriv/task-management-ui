import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    cors: true,
    hmr: {
      protocol: 'wss',
      host: 'taskm.duckdns.org',
      port: 443,
      clientPort: 443
    },
    watch: {
      usePolling: true
    }
  }
})
