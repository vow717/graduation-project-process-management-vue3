import { createProgressNotification } from '@/components/progress'
import type { Process, ProcessFile, ProcessScore, Progress, User } from '@/datasource/type'
import { useDelete, useGet, usePatch, usePost, usePut } from '@/fetch'
import { useInfosStore } from '@/stores/InfosStore'
import { useProcessInfosStore } from '@/stores/ProcessInfosStore'
import { useProcessStore } from '@/stores/ProcessStore'
import { useUsersStore } from '@/stores/UsersStore'
import {
  ClearStoreCache,
  ELLoading,
  storeCacheFactory,
  storeCacheMapFactory
} from './decorators/decorators'
export class TeacherService {
  //获取本专业所有老师
  @storeCacheFactory(useUsersStore().allTeachersS)
  @ELLoading()
  static async listAllTeachersService() {
    const data = await useGet<User[]>('teacher/teachers')
    return data.data.value?.data as unknown as User[]
  }

  //获取本专业所有学生
  @storeCacheFactory(useUsersStore().allStudentsS)
  @ELLoading()
  static async listAllStudentsService() {
    const data = await useGet<User[]>('teacher/students')
    return data.data.value?.data as unknown as User[]
  }
  //根据number获取学生消息
  static async findUserByNumber(number: string) {
    const data = await useGet<User>(`teacher/users/${number}`)
    return data.data.value?.data as unknown as User[]
  }
  //添加多个学生
  @storeCacheFactory(useUsersStore().allStudentsS)
  @ELLoading()
  static async addStudentsService(users: User[]) {
    // 遍历users数组，将student属性转换为字符串，因为student属性是一个对象，需要转换为字符串，如果student属性为空，则不需要转换
    users.forEach((u) => {
      // //@ts-ignore是忽略ts检查的语法，因为student属性是自定义的，ts无法识别，所以需要忽略检查
      //@ts-ignore
      u.student && (u.student = JSON.stringify(u.student))
    })
    const data = await usePost<User[]>('teacher/students', JSON.stringify(users))
    return data.data.value?.data as unknown as User[]
  }
  //修改多个学生的信息
  @ClearStoreCache(useUsersStore().clear)
  @storeCacheFactory(useUsersStore().allStudentsS)
  @ELLoading()
  static async updateStudentsService(users: User[]) {
    users.forEach((u) => {
      //@ts-ignore
      u.student && (u.student = JSON.stringify(u.student))
    })
    const data = await usePatch<User[]>('teacher/students', JSON.stringify(users))
    return data.data.value?.data as unknown as User[]
  }

  //重置学生密码
  static async resetPassword(number: string) {
    const data = await usePut<User[]>(`teacher/passwords/${number}`)
    return data.data.value?.data as unknown as User[]
  }
  //获取指导学生
  @storeCacheFactory(useUsersStore().tutorStudentsS)
  @ELLoading()
  static async listTutorStudentsService() {
    const data = await useGet<User[]>(`teacher/students/tutor`)
    return data.data.value?.data as unknown as User[]
  }
  //获取同组学生
  @storeCacheFactory(useUsersStore().groupStudentsS)
  @ELLoading()
  static async listGroupStudentsService() {
    const data = await useGet<User[]>('teacher/students/group')
    return data.data.value?.data as unknown as User[]
  }

  //加载小组全部评分
  @storeCacheFactory(useProcessInfosStore().groupProcessScoresS)
  @ELLoading()
  static async listProcessScoresGroupService() {
    const data = await useGet<ProcessScore[]>('teacher/processscores/groups')
    return data.data.value?.data as unknown as ProcessScore[]
  }

  //加载小组/审阅的某个流程的全部同学成绩score
  @storeCacheMapFactory(useProcessInfosStore().processScoresMapS)
  @ELLoading()
  static async listProcessesProcessScoresService(pid: string, auth: string) {
    const data = await useGet<ProcessScore[]>(`teacher/processes/${pid}/types/${auth}`)
    return data.data.value?.data as unknown as ProcessScore[]
  }
  //加载小组/审阅的某个流程的全部同学文件file
  @storeCacheMapFactory(useProcessInfosStore().processFilesMapS)
  @ELLoading()
  static async listProcessFilesService(pid: string, auth: string) {
    const data = await useGet<ProcessFile[]>(`teacher/processfiles/${pid}/types/${auth}`)
    return data.data.value?.data as unknown as ProcessFile[]
  }

  // //下载文件,并且显示进度条,progressR是一个ref对象，用于存储进度条的数据
  // static getProcessFilesService=async(pid: string) {
  //   const pname = encodeURIComponent(name)
  //   const progressR = ref<{ progress: Progress }>({
  //     progress: { percentage: 0, title: name, rate: 0, total: 0, loaded: 0 }
  //   })
  //   const progNotif = createProgressNotification(progressR.value)
  //   const resp = await axios.get(`${TEACHER}/download/${pname}`, {
  //     responseType: 'blob',
  //     onDownloadProgress(ProgressEvent) {
  //       if (!ProgressEvent) return
  //       progressR.value.progress.percentage = ProgressEvent.progress ?? 0
  //       progressR.value.progress.rate = ProgressEvent.rate ?? 0
  //       progressR.value.progress.loaded = ProgressEvent.loaded ?? 0
  //       progressR.value.progress.total = ProgressEvent.total ?? 0
  //     }
  //   })
  //   progNotif.close()
  //   const filename = decodeURIComponent(resp.headers['filename'])
  //   const url = window.URL.createObjectURL(new Blob([resp.data]))
  //   const link = document.createElement('a')
  //   link.href = url
  //   link.setAttribute('download', filename)
  //   document.body.appendChild(link)
  //   link.click()

  //   window.URL.revokeObjectURL(url)
  //   document.body.removeChild(link)
  // }

  static async getProcessFilesService(name: string) {
    const pname = encodeURIComponent(name)
    const progressR = ref<{ progress: Progress }>({
      progress: { percentage: 0, title: name, rate: 0, total: 0, loaded: 0 }
    })
    const progNotif = createProgressNotification(progressR.value)

    const response = await fetch(`/api/teacher/download/${pname}`, {
      method: 'GET',
      headers: {
        token: sessionStorage.getItem('token') || ''
      }
    })
    console.log(response)
    if (!response.body) {
      throw new Error('Response body is null')
    }
    const reader = response.body.getReader()
    const contentLength = response.headers.get('Content-Length')
    const total = contentLength ? parseInt(contentLength, 10) : 0

    const readData = async () => {
      let receivedLength = 0
      const chunks = []
      const startTime = Date.now()
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        chunks.push(value)
        receivedLength += value.length
        progressR.value.progress.loaded = receivedLength
        progressR.value.progress.total = total
        progressR.value.progress.percentage = Math.round((receivedLength / total) * 100)
        // 计算经过的时间
        const elapsedTime = Date.now() - startTime
        // 避免除以0的情况，如果时间为0，速率设为0
        const rate = elapsedTime > 0 ? receivedLength / elapsedTime : 0
        progressR.value.progress.rate = rate * 1000
      }
      return new Blob(chunks)
    }

    const blob = await readData()
    progNotif.close() // 关闭进度条

    const filename = decodeURIComponent(response.headers.get('filename') ?? '')
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()

    URL.revokeObjectURL(url)
    document.body.removeChild(link)
  }

  @ELLoading()
  @ClearStoreCache(useProcessInfosStore().clear)
  @storeCacheMapFactory(useProcessInfosStore().processScoresMapS, [0, 1])
  static async addProcessScoreService(pid: string, auth: string, ps: ProcessScore) {
    //@ts-ignore
    ps.detail = JSON.stringify(ps.detail)
    const data = await usePost<ProcessScore[]>(`teacher/processscores/types/${auth}`, ps)
    return data.data.value?.data as unknown as ProcessScore[]
  }

  @ELLoading()
  @storeCacheFactory(useInfosStore().groupTeachersS)
  static async listGroupTeachersService() {
    const data = await useGet<User[]>('teacher/teachers/group')
    return data.data.value?.data as unknown as User[]
  }

  @storeCacheFactory(useProcessStore().processesS, false)
  static async addProcessService(ps: Process) {
    //@ts-ignore
    ps.items = JSON.stringify(ps.items)
    //@ts-ignore
    ps.studentAttach = JSON.stringify(ps.studentAttach)

    const data = await usePost<Process[]>('teacher/processes', ps)
    console.log(data)
    return data.data.value?.data as unknown as Process[]
  }

  @storeCacheFactory(useProcessStore().processesS, false)
  @ELLoading()
  static async delProcessService(pid: string) {
    const data = await useDelete<Process[]>(`teacher/processes/${pid}`)
    return data.data.value?.data as unknown as Process[]
  }
}
