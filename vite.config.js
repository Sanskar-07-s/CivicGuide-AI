import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use subfolder for GitHub Pages, but root for Vercel/Local
  base: process.env.VERCEL || process.env.NODE_ENV !== 'production' ? '/' : '/CivicGuide-AI/',
})
