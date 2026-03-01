import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ASTU_smart_complaint_and_issues_tracking_sysem/',
  server: {
    port: 5173,
    open: true
  }
})