import type { Process } from '@/datasource/type'
import { defineAsyncComponent, h, render } from 'vue'

export const createChangeProcessDialog = (process: Process) => {
  const node = h(
    defineAsyncComponent(() => import('./ChangeProcess.vue')),
    { process }
  )
  render(node, document.body)
}
