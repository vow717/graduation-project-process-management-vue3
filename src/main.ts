import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//不要忘了配置mock
//import('@/mock/index')

// package.json 中的 scripts 配置里：
// 老师："build": "run-p type-check \"build-only {@}\" --",
// npm install npm-run-all --save-dev
// 如果没有安装 npm-run-all 这个工具，运行 build 脚本时会报错，提示找不到 run-p 命令。

import { createAlertDialog } from '@/components/message/index'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)

app.mount('#app')

app.config.errorHandler = (err) => {
  const message = err as string

  console.error(message)
  createAlertDialog(message)
}
