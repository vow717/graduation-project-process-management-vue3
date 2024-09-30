import * as consty from '@/datasource/const'
import type { User } from '@/datasource/type'
import { usePost } from '@/fetch'
import router from '@/router'
import { useUserStore } from '@/stores/LoginStore.ts'

export const loginGuardService = async (user: { number: string; password: string }) => {
  const resp = await usePost<{ user: User }>('login-guard', user)

  const token = resp.response.value?.headers.get('token')
  token && sessionStorage.setItem('token', token)
  const role = resp.response.value?.headers.get('role')
  role && sessionStorage.setItem('role', role)
  const userS = useUserStore().userS
  resp.data.value?.data && (userS.value = resp.data.value?.data.user)
  let path = '/login'

  switch (role) {
    case consty.USER:
      path = '/user'
      break
    case consty.ADMIN:
      path = '/admin'
      break
  }
  router.push(path)
}
