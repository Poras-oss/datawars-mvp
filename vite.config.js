import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv';

config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
 resolve: {
    alias: {
      '@components': '/src/components',
      '@utils': '/src/utils',
    },
    define: {
      'process.env': process.env
    },
  },
})
