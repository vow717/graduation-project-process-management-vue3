import type { ProcessFile, ProcessScore } from '@/datasource/type'
import { ref } from 'vue'
// 因为有多个processFiles和processScores要缓存，map根据processId找更快
const processFilesMapS = ref<Map<string, ProcessFile[]>>(new Map())
const processScoresMapS = ref<Map<string, ProcessScore[]>>(new Map())
const allProcessScoresS = ref<ProcessScore[]>()
const groupProcessScoresS = ref<ProcessScore[]>()
const clear = () => {
  groupProcessScoresS.value = undefined
  processScoresMapS.value.clear()
  allProcessScoresS.value = undefined
}
const store = { processScoresMapS, allProcessScoresS, processFilesMapS, groupProcessScoresS, clear }

export const useProcessInfosStore = () => store
