import type { Process, StudentAttach } from '@/datasource/type'
import { ref } from 'vue'
const processesS = ref<Process[]>()
const studentProcessesS = ref<StudentAttach[]>()
const store = { processesS, studentProcessesS }
export const useProcessStore = () => {
  return store
}
