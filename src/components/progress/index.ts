import type { Progress } from '@/datasource/type'
import { ElNotification } from 'element-plus'
import { h } from 'vue'
import ProgressVue from './ProgressVue.vue'

export const createProgressNotification = (progress: { progress: Progress }) => {
  const noti = ElNotification({
    title: '下载进度',
    message: h(ProgressVue, progress),
    type: 'success',
    duration: 0 // 不自动关闭
  })

  const close = () => noti.close()
  return { close }
}
