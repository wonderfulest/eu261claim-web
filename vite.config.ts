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
    port: 3000,
    proxy: {
      '^/api/flights/.*': {
        target: 'http://localhost:3001', // 航班查询服务器端口
        changeOrigin: true,
        secure: false,
      },
      '^/api/tracker/.*': {
        target: 'http://localhost:3001', // 追踪服务器端口
        changeOrigin: true,
        secure: false,
      },
      '^/api/.*': {
        target: 'http://localhost:8088',
        // target:  'https://api.wristo.io',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    },
  },
})
