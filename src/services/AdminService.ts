import type { Department, User } from '@/datasource/type'
import { useDelete, useGet, usePost } from '@/fetch'

export class AdminService {
  static async addTeachersByExcelService(teachers: User[], did: string) {
    teachers.forEach((t) => {
      // @ts-ignore
      t.teacher = JSON.stringify(t.teacher)
    })
    const data = await usePost<User[]>(`admin/teachers/${did}`, JSON.stringify(teachers))
    return data.data.value?.data as unknown as User[]
  }

  static async listDepartmentsService() {
    const data = await useGet<Department[]>('admin/departments')
    return data.data.value?.data as unknown as Department[]
  }

  static async addDepartmentService(department: Department) {
    const data = await usePost<Department>('admin/departments', department)
    return data.data.value?.data as unknown as Department
  }

  static async delDepartmentService(did: string) {
    const data = await useDelete<Department>(`admin/departments/${did}`)
    return data.data.value?.data as unknown as Department
  }
}
