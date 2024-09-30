import type { User } from '@/datasource/type'
import { ref } from 'vue'

const userS = ref<User>()

const store = { userS }
export const useUserStore = () => {
  return store
}
