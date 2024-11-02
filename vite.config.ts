import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  //仅在本地前后端调联测试时有效，生产环境下部署无效
  server: {
    proxy: {
      '/api/': {
        target: 'http://120.46.159.231:8081',
        changeOrigin: true
      }
    }
  }
})
