import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { qrcode } from 'vite-plugin-qrcode'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), qrcode()],
  base: '/kaamos/',
  server: {
    port: 5173,
    host: true, // Expose to network
    allowedHosts: true
  }
})
