import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works under https://<user>.github.io/<repo>/ without hard-coding the repo name.
export default defineConfig({
  base: './',
  plugins: [react()],
})
