import { createAlertDialog } from '@/components/message'
import type { ResultVO } from '@/datasource/type'
import { createFetch } from '@vueuse/core'
//请求/响应拦截器，即在请求发出前/响应返回后，先进入拦截器执行统一处理

export const useFetch = createFetch({
  baseUrl: '/',
  options: {
    beforeFetch: ({ options }) => {
      //从sessionStorage中取值
      const token = sessionStorage.getItem('token')
      if (token) {
        options.headers = {
          ...options.headers,
          token: token
        }
      }
      return { options }
    },
    afterFetch: (ctx) => {
      const data: ResultVO<{}> = ctx.data
      if (data.code != 200) {
        return Promise.reject(data.message)
      }
      return ctx
    },
    onFetchError: (ctx) => {
      createAlertDialog(ctx.error)
      return Promise.reject(ctx.error)
    }
  }
})

export async function usePost<T>(url: string, data: unknown) {
  const resp = useFetch(url, { immediate: false }).post(data).json<ResultVO<T>>()
  await resp.execute(true)
  return resp
}
