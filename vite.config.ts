import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import requestResume from './api/request-resume.js'
import resumeStatus from './api/resume-status.js'
import resumeDelivered from './api/resume-delivered.js'

export default defineConfig(({ mode }) => {
  // Server-only variables are never exposed via import.meta.env to the browser.
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }
  return {
    plugins: [react(), tailwindcss(), {
      name: 'local-resume-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const path = new URL(req.url || '/', 'http://localhost').pathname
          const handler = { '/api/request-resume': requestResume, '/api/resume-status': resumeStatus, '/api/resume-delivered': resumeDelivered }[path]
          if (!handler) return next()
          void handler(req, res).catch(() => {
            if (!res.headersSent) res.statusCode = 500
            res.end(JSON.stringify({ error: 'Unable to process this request.' }))
          })
        })
      },
    }],
    server: {
      fs: {
        // Vite can otherwise serve root files directly in development.
        deny: ['.env', '.env.*', '**/*.{crt,pem}', '**/.git/**', '**/private/**', '**/server/**', '**/api/**'],
      },
    },
  }
})
