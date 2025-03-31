import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "./", // Ensure Vue loads assets from the correct path
  plugins: [react()],
})