import type { ProcessFile, ProcessScore, User } from '@/datasource/type'
import { useGet, usePost } from '@/fetch'
import { useProcessInfosStore } from '@/stores/ProcessInfosStore'
import { useUsersStore } from '@/stores/UsersStore'
import { storeCacheFactory, storeCacheMapFactory } from './decorators/decorators'
export class TeacherService {
  //获取指导学生
  @storeCacheFactory(useUsersStore().tutorStudentsS)
  static async listTutorStudentsService() {
    const data = await useGet<User[]>(`teacher/students/tutor`)
    return data.data.value?.data as unknown as User[]
  }

  //获取同组学生
  @storeCacheFactory(useUsersStore().groupStudentsS)
  static async listGroupStudentsService() {
    const data = await useGet<User[]>('teacher/students/group')
    return data.data.value?.data as unknown as User[]
  }

  //加载小组全部评分
  @storeCacheFactory(useProcessInfosStore().groupProcessScoresS)
  static async listProcessScoresGroupService() {
    const data = await useGet<ProcessScore[]>('teacher/processscores/groups')
    return data.data.value?.data as unknown as ProcessScore[]
  }

  //加载小组/审阅的某个流程的全部同学成绩score
  @storeCacheMapFactory(useProcessInfosStore().processScoresMapS)
  static async listProcessesProcessScoresService(pid: string, auth: string) {
    const data = await useGet<ProcessScore[]>(`teacher/processes/${pid}/types/${auth}`)
    return data.data.value?.data as unknown as ProcessScore[]
  }
  //加载小组/审阅的某个流程的全部同学文件file
  @storeCacheMapFactory(useProcessInfosStore().processFilesMapS)
  static async listProcessFilesService(pid: string, auth: string) {
    const data = await useGet<ProcessFile[]>(`teacher/processfiles/${pid}/types/${auth}`)
    return data.data.value?.data as unknown as ProcessFile[]
  }

  @storeCacheMapFactory(useProcessInfosStore().processScoresMapS)
  static async addProcessScoreService(pid: string, auth: string, ps: ProcessScore) {
    ps.detail = JSON.stringify(ps.detail)
    const data = await usePost<ProcessScore[]>(`teacher/processscores/types/${auth}`, ps)
    return data.data.value?.data as unknown as ProcessScore[]
  }
}
