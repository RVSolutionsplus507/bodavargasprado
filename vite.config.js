// vite.config.js
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "url"
import path from "path"

// Crear un equivalente a __dirname para ESM
const __dirname = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: []
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
})

