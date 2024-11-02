import * as consty from '@/datasource/const'
import type { Process, User } from '@/datasource/type'
import { useGet, usePost } from '@/fetch'
import router from '@/router'
import { useProcessStore } from '@/stores/ProcessStore'
import { useUserStore } from '@/stores/UserStore'
import { storeCacheFactory } from './decorators/decorators'

export class CommonService {
  static loginGuardService = async (user: User) => {
    const resp = await usePost<User>('login', user)
    console.log('111')
    const us = resp.data.value?.data
    const token = resp.response.value?.headers.get('token')
    const role = resp.response.value?.headers.get('role')
    console.log(us, token, role)
    if (!us || !token || !role) {
      throw '登录错误'
    }
    useUserStore().userS.value = us
    useUserStore().setUserSessionStorage(us)
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('role', role)

    if (user.number == user.password) {
      router.push('/settings')
      return
    }

    let path = '/login'
    switch (role) {
      case consty.ADMIN:
        path = '/admin'
        break
      case consty.STUDENT:
        path = '/student'
        break
      case consty.TEACHER:
        path = '/teacher'
        break
    }
    router.push(path)
  }

  static getRole() {
    return sessionStorage.getItem('role')
  }

  @storeCacheFactory(useProcessStore().processesS)
  static async listProcessesService() {
    const data = await useGet<Process[]>('processes')
    return data.data.value?.data as unknown as Process[]
  }
}
