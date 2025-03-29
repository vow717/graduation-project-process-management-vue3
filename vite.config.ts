import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'
//npm install vite-plugin-compression -D 用于压缩文件
// https://vitejs.dev/config/
export default defineConfig({
  worker: {
    format: 'es' // worker 线程使用 ES 模块格式
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router']
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    /*
    参数含义如下：
    ViteCompression 插件用于压缩构建后的文件，减少文件体积，提高加载速度。
verbose：是一个布尔值，设为true时，会在控制台输出压缩相关的详细信息，如哪些文件被压缩等。
disable：也是布尔值，设为false表示启用压缩功能。如果设为true，则不会进行压缩。
threshold：表示只有文件大小大于这个值（单位是字节）的文件才会被压缩。这里设为10240，即 10KB，意味着小于 10KB 的文件不会被压缩。
algorithm：指定压缩算法，这里设为gzip，是最常用的压缩算法之一。
ext：指定压缩后文件的扩展名，这里设为.gz，这样压缩后的文件会以原文件名加上.gz的形式存在。

nginx里面：
  gzip_static on;开启静态压缩
  gzip_http_version 1.1;设置在 HTTP/1.1 协议下启用 Gzip 压缩，确保只有符合 HTTP/1.1 协议的请求才会被考虑进行 Gzip 压缩
  proxy_http_version 1.1;用于指定在转发请求时使用的 HTTP 协议版本
    */
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  //仅在本地前后端调联测试时有效，生产环境下部署无效
  server: {
    proxy: {
      '/api/': {
        //target: 'http://120.46.159.231:8081',
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
