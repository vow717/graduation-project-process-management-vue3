import { createAlertDialog } from '@/components/message'
import type { ResultVO } from '@/datasource/type'
import { createFetch } from '@vueuse/core'
//请求/响应拦截器，即在请求发出前/响应返回后，先进入拦截器执行统一处理

// 递归实现反序列化为JS对象
const parseObject = (data: any) => {
  let newValue = data

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Array) {
      value.forEach((d) => {
        parseObject(d)
      })
    }
    if (typeof value == 'object') {
      parseObject(value)
    }

    if (typeof value == 'string' && (value.includes('{"') || value.includes('['))) {
      try {
        newValue = JSON.parse(value)
        if (typeof newValue == 'object') {
          data[key] = parseObject(newValue)
        }
      } catch (error) {
        //
      }
    }
  }
  return newValue
}

export const useFetch = createFetch({
  baseUrl: '/api',
  options: {
    beforeFetch: ({ options }) => {
      //从sessionStorage中取值
      const token = sessionStorage.getItem('token')
      if (token) {
        options.headers = {
          ...options.headers,
          token: token
          // 'Content-Type': 'application/json'
        }
      }
      return { options }
    },
    afterFetch: (ctx) => {
      //如果是blob类型的数据，直接返回，因为下载文件不需要处理（后端是MediaType.APPLICATION_OCTET_STREAM）
      if (ctx.response.headers.get('Content-Type')?.includes('application/octet-stream')) {
        console.log('blob data')
        return ctx
      }
      const data: ResultVO<{}> = ctx.data
      if (data.code != 200) {
        return Promise.reject(data.message)
      }
      // 调用 parseObject 函数对数据进行处理
      parseObject(data)
      return ctx
    },
    onFetchError: (ctx) => {
      console.log('error:{}', ctx)
      createAlertDialog(ctx.error)
      return Promise.reject(ctx.error)
    }
  }
})

export async function usePost<T>(url: string, data: unknown, headers?: { [key: string]: string }) {
  const resp = useFetch(url, { headers: headers }, { immediate: false })
    .post(data)
    .json<ResultVO<T>>()
  await resp.execute(true)
  return resp
}
export async function usePatch<T>(url: string, data: unknown) {
  const resp = useFetch(url, { immediate: false }).patch(data).json<ResultVO<T>>()
  await resp.execute(true)
  return resp
}
export async function usePut<T>(url: string) {
  const resp = useFetch(url, { immediate: false }).put().json<ResultVO<T>>()
  await resp.execute(true)
  return resp
}
export async function useGet<T>(url: string) {
  const resp = useFetch(url, { immediate: false }).get().json<ResultVO<T>>()
  await resp.execute(true)
  return resp
}

export async function useDelete<T>(url: string) {
  const resp = useFetch(url, { immediate: false }).delete().json<ResultVO<T>>()
  await resp.execute(true)
  return resp
}
