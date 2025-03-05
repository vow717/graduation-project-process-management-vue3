import type { ProcessFile } from '@/datasource/type'
import { useGet, usePost } from '@/fetch'

export class StudentService {
  static async uploadFileService(pid: string, number: number, encoder: string, fdate: FormData) {
    const resp = await usePost<ProcessFile[]>(`student/upload/${pid}/numbers/${number}`, fdate, {
      xtoken: encoder
    })
    return resp.data.value?.data as ProcessFile[]
  }

  // sign是一个签名函数，接受一个字符串参数，返回一个字符串，用于前后端数据传输的签名
  static uploadFileSignatureService = async (msg: string) => {
    // 这里的window.btoa和window.encodeURIComponent是浏览器提供的全局函数，用于base64编码和url编码
    //encodeURIComponent方法是将字符串转换为url编码，因为base64编码中可能包含空格、&、#、%等特殊符号，url传输中需要将他们用%xx来表示。
    //btou方法是将字符串转换为base64编码
    return window.btoa(window.encodeURIComponent(msg)).substring(0, 10)
  }

  //获取该学生的所有文件
  static async listProcessFilesService(pid: string) {
    const data = await useGet<ProcessFile[]>(`student/processfiles/${pid}`)
    return data.data.value?.data as unknown as ProcessFile[]
  }

  // 上传头像服务
  static async uploadAvatarService(formData: FormData) {
    const resp = await usePost(`avatar`, formData)
    return resp.data // 返回响应数据
  }

  // 获取头像服务
  static async getAvatarService() {
    const response = await fetch(`/api/avatar`, {
      method: 'GET',
      headers: {
        token: sessionStorage.getItem('token') || '' // 如果需要token
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch avatar')
    }
    return response.blob() // 返回Blob数据
  }
}
