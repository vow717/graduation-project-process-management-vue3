import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//不要忘了配置mock
//import('@/mock/index')

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
