import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Reads GEMINI_API_KEY from your .env file.
  // No "VITE_" prefix = it never gets bundled into the browser code.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        // The browser calls /api/gemini/... and Vite forwards it to Google,
        // adding the secret key on the way. The key stays on your machine.
        '/api/gemini': {
          target: 'https://generativelanguage.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/gemini/, ''),
          headers: { 'x-goog-api-key': env.GEMINI_API_KEY || '' },
        },
      },
    },
  }
})
