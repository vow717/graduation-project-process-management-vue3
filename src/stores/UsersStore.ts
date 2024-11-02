import type { User } from '@/datasource/type'
import { ref } from 'vue'

const tutorStudentsS = ref<User[]>()
const groupStudentsS = ref<User[]>()
const allStudentsS = ref<User[]>()
const allTeachersS = ref<User[]>()
const clear = () => {
  tutorStudentsS.value = undefined
  groupStudentsS.value = undefined
  allStudentsS.value = undefined
  allTeachersS.value = undefined
}
const store = { allStudentsS, allTeachersS, tutorStudentsS, groupStudentsS, clear }
export const useUsersStore = () => store
