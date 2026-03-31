import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
const API_URL = "https://your-backend.onrender.com";
export default defineConfig({
  plugins: [react(),tailwindcss()],
})
