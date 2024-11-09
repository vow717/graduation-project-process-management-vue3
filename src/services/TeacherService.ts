import type { Process, ProcessFile, ProcessScore, User } from '@/datasource/type'
import { useDelete, useGet, usePost } from '@/fetch'
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

  @ELLoading()
  @ClearStoreCache(useProcessInfosStore().clear)
  @storeCacheMapFactory(useProcessInfosStore().processScoresMapS, [0, 1])
  static async addProcessScoreService(pid: string, auth: string, ps: ProcessScore) {
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
    ps.items = JSON.stringify(ps.items)
    ps.studentAttach = JSON.stringify(ps.studentAttach)
    console.log('111')
    const data = await usePost<Process[]>('teacher/processes', ps)
    console.log(data)
    return data.data.value?.data as unknown as Process[]
  }

  @storeCacheFactory(useProcessStore().processesS, false)
  @ELLoading()
  static async delProcessService(pid: string) {
    const data = await useDelete<Process[]>(`teacher/processes/${pid}`, pid)
    return data.data.value?.data as unknown as Process[]
  }
}
