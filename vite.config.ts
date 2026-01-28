import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  base: '/', // Ensure base URL is set to root
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true, // 监听所有地址
    port: 9003,
    proxy: {
      '^/api/.*': {
        target: 'http://localhost:9000',
        // target:  'https://www.eu261claim.com',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    },
  },
})
