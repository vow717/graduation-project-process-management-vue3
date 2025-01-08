import type { Process, StudentAttach } from '@/datasource/type'
import { ref } from 'vue'
const processesS = ref<Process[]>()
const studentProcessesS = ref<StudentAttach[]>()
const clear = () => {
  processesS.value = undefined
  studentProcessesS.value = undefined
}
const store = { processesS, studentProcessesS, clear }
export const useProcessStore = () => {
  return store
}
