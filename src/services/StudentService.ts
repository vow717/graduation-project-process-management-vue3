import type { ProcessFile } from '@/datasource/type'
import { useGet, usePost } from '@/fetch'

export class StudentService {
  static async uploadFileService(pid: string, number: number, encoder: string, fdate: FormData) {
    console.log('uploadFileService', pid, number, encoder, fdate)
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

  //---------------大文件分片上传------------------
  // 创建文件切片
  static createChunks = (file: File) => {
    const CHUNK_SIZE = 1024 * 500 // 500kb
    let cur: number = 0
    const chunks: Blob[] = []
    while (cur < file.size) {
      const chunk = file.slice(cur, cur + CHUNK_SIZE)
      chunks.push(chunk)
      cur += CHUNK_SIZE
    }
    console.log('chunks', chunks)
    return chunks
  }

  // 计算文件 hash 值
  static calculateHash = (chunks: Blob[]) => {
    return new Promise((resolve, reject) => {
      /// 这里我们使用 web worker 来计算 hash 值，因为计算 hash 值是一个耗时的操作，如果在主线程中计算会导致页面卡顿，所以我们使用 web worker 来计算 hash 值。
      //new URl('@/workers/hash.worker.ts', import.meta.url) 是一个 ES6 模块的语法，表示在当前模块中引入一个新的模块。type: 'module' 是一个选项，表示这个模块是一个 ES6 模块。
      const worker = new Worker(new URL('@/workers/hash.worker.ts', import.meta.url), {
        type: 'module'
      })
      worker.onmessage = (e: MessageEvent<{ hash?: string; error?: string }>) => {
        if (e.data.error) {
          reject(new Error(e.data.error))
        } else if (e.data.hash) {
          resolve(e.data.hash)
        }
        worker.terminate() // 计算完成后，终止 worker
      }
      worker.onerror = (error: ErrorEvent) => {
        reject(new Error(error.message))
        worker.terminate() // 计算完成后，终止 worker
      }
      worker.postMessage({ chunks }) // 发送切片数据给 worker
    })
  }

  // 生成上传所需的 formData 数组
  static generateFormData = (chunks: Blob[], hash: string, fileName: string, pname: string) => {
    const data = chunks.map((chunk: Blob, index: number) => {
      return {
        fileHash: hash, // 文件的 hash 值
        chunkIndex: index, // 切片的索引
        chunk: chunk // 切片
      }
    })
    return data.map((item) => {
      const formData = new FormData()
      formData.append('fileHash', item.fileHash)
      formData.append('chunkIndex', item.fileHash + '-' + item.chunkIndex)
      console.log('file')
      formData.append('chunk', item.chunk, fileName) // formData.append是一个方法，用于将数据添加到 FormData 对象中。而且这个方法可以接受三个参数，第一个参数是字段名，第二个参数是字段值，第三个参数是文件名。
      formData.append('pname', pname) // 过程名称
      return formData
    })
  }

  // 限制并发上传任务
  static uploadWithConcurrencyLimit = async (formData: FormData[]) => {
    const maxConcurrent = 5 // 最大并发数量
    let currentIndex = 0 // 当前上传的切片索引
    const taskPool: Promise<any>[] = [] // 任务池
    while (currentIndex < formData.length) {
      // fetch 是一个异步请求，返回一个 Promise 对象,所以可以用.finally()方法来处理请求完成后的操作
      const task = fetch(`/api/student/uploadByChunks`, {
        method: 'POST',
        headers: {
          token: sessionStorage.getItem('token') || '' // 如果需要 token
        },
        body: formData[currentIndex]
      })
        .then(() => {
          // console.log('完成一个')
        })
        .catch((error) => {
          console.error('Upload error:', error)
        })
        .finally(() => {
          const index = taskPool.findIndex((t) => t === task)
          if (index > -1) {
            taskPool.splice(index, 1) // 从任务池中删除任务
          }
        })
      taskPool.push(task) // 将任务加入任务池
      if (taskPool.length >= maxConcurrent) {
        await Promise.race(taskPool) // 等待任务池中的任务完成
      }
      currentIndex++ // 切片索引加 1
    }
    // 等待所有任务完成
    await Promise.all(taskPool)
  }

  // 检查文件是否存在（秒传）
  static async checkFileExists(hash: string) {
    return usePost(`student/checkFile`, hash)
  }

  // 检查已上传分片
  static async checkChunks(hash: String, pname: String) {
    const resp = await usePost(`student/checkChunks/${pname}`, hash)
    return resp.data.value?.data
  }
  static async uploadFileByChunksService(
    file: File,
    fileName: string,
    number: number,
    pid: string,
    pname: string
  ) {
    // 这里的 file 是一个 File 对象，fileName 是文件名，number 是文件序号，pid 是过程 id，pname 是过程名称
    //文件序号是因为一个过程可能有多个文件，所以需要一个序号来区分
    // 过程 id 是为了区分不同的过程，过程名称是后端存储/创建文件夹用的
    const chunks = this.createChunks(file) // 切片
    const hash = (await this.calculateHash(chunks)) as string // 计算 hash 值

    // 秒传
    // 先检查文件是否存在，如果存在就直接返回
    const data = (await this.checkFileExists(hash)) as any
    if (data.data.value?.data.exists) {
      console.log('文件已存在，秒传成功')
      return // 秒传成功，直接返回
    }
    // 检查已上传分片
    const checkChunks = (await this.checkChunks(hash, pname)) as any
    console.log('已上传分片', checkChunks)
    const needUploadChunks = chunks.filter((_, index) => !checkChunks.includes(index.toString())) // 需要上传的分片
    const formDataArray = this.generateFormData(needUploadChunks, hash, fileName, pname) // 生成 formData 数组
    console.log('formDataArray', formDataArray)
    await this.uploadWithConcurrencyLimit(formDataArray) // 限制并发上传任务
    // 上传完成后，向后端发送一个请求，告诉后端文件上传完成
    // 所有分片上传完成后，通知后端合并文件
    const formDataOver = new FormData()
    formDataOver.append('fileHash', hash)
    formDataOver.append('pname', pname)
    formDataOver.append('filename', fileName)
    const mergeTask = fetch(`/api/student/complete/${pid}/numbers/${number}`, {
      method: 'POST',
      headers: {
        token: sessionStorage.getItem('token') || ''
      },
      body: formDataOver
    })
    const mergeResp = await mergeTask
    console.log(mergeResp)
  }
}
