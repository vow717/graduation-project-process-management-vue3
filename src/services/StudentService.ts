import type { ProcessFile } from '@/datasource/type'
import { useGet, usePost } from '@/fetch'
import SparkMD5 from 'spark-md5'

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
    const CHUNK_SIZE = 1024 * 50 // 50kb
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
  // 切完片，要进行 hash 计算
  // 首先我们考虑，怎么样去区分一个不同的文件呢？首先文件名字肯定是不行的，因为文件名是可以修改的。我们可以考虑文件的内容，文件的内容是不会变的。我们可以对文件进行 hash 计算，计算出一个 hash 值，这个 hash 值就是这个文件的唯一标识符。
  // 我们可以使用 md5 算法来计算文件的 hash 值。md5 算法是一个常用的 hash 算法，可以将任意长度的数据转换为一个 hash 值。我们可以使用 spartk-md5 这个库来计算文件的 hash 值。
  // import SparkMD5 from 'spark-md5'
  // 借助这个 hash 值，我们还可以实现秒传输的功能。我们可以先计算出文件的 hash 值，然后将 hash 值传给后端，后端根据 hash 值判断这个文件是否已经存在，如果存在就直接不用处理上传请求了，给用户的感觉就好像是秒传了一样。
  static calculateHash = (chunks: Blob[]) => {
    return new Promise((resolve, reject) => {
      // 考虑到文件可能会很大，不能用全部的数据来计算 hash 值，那么我们可以只用文件的前面，中间，后面各 2 个字节来计算 hash 值。这样就可以大大减少计算 hash 值的时间了。
      // 第一个和最后一个切片参与计算，而中间的切片只计算前面，中间，后面各 2 个字节
      const targets: Blob[] = [] // 存储所有参与计算的切片
      chunks.forEach((chunk, index) => {
        if (index === 0 || index === chunks.length - 1) {
          targets.push(chunk)
        } else {
          targets.push(chunk.slice(0, 2))
          targets.push(chunk.slice(chunk.size - 2))
          targets.push(chunk.slice(chunk.size / 2 - 2, chunk.size / 2 + 2))
        }
      })
      const spark = new SparkMD5.ArrayBuffer()
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(new Blob(targets))
      fileReader.onload = () => {
        spark.append(fileReader.result as ArrayBuffer)
        resolve(spark.end())
      }
      fileReader.onerror = (error) => {
        reject(new Error('Error reading file: ' + error))
      }
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
          console.log('完成一个')
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
    const formDataArray = this.generateFormData(chunks, hash, fileName, pname) // 生成 formData 数组
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
