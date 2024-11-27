import type { Process } from '@/datasource/type'
import { defineAsyncComponent, h, render } from 'vue'

export const createChangeProcessDialog = (process: Process, allPoint: number) => {
  const node = h(
    defineAsyncComponent(() => import('./ChangeProcess.vue')),
    { process, allPoint }
  )
  render(node, document.body)
}
