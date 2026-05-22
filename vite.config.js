import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600, // লিমিট বাড়িয়ে 1600 kb (1.6 MB) করে দেওয়া হলো
  }
})