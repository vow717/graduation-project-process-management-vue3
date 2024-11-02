import type { User } from '@/datasource/type'
import { ref } from 'vue'

/*
首先创建了两个全局对象 textCoder 和 textDecoder，分别是 TextEncoder 和 TextDecoder 的实例。TextEncoder 用于将字符串编码为 Uint8Array（字节数组），TextDecoder 用于将 Uint8Array 解码回字符串。
定义了两个辅助函数 asc 和 dasc，用于进行特定字符的替换操作。
定义了 encode 和 decode 两个主要函数，分别用于对字符串进行编码和解码操作。
*/
const textCoder = new TextEncoder()
const textDecoder = new TextDecoder()

const asc = (str: string) => str.replace(/20/g, '=').replace(/3/g, '/').replace(/6/g, 'x')
const dasc = (str: string) => str.replace(/=/g, '20').replace(/\//g, '3').replace(/x/g, '6')

const encode = (str: string) => {
  const deResult: string[] = []
  textCoder.encode(str).forEach((r) => {
    deResult.push(r.toString(17))
  })
  return asc(deResult.join(''))
}

const decode = (str: string) => {
  const dascStr = dasc(str)
  const deResult: number[] = []
  for (let i = 0; i < dascStr.length; i += 2) {
    const st0 = dasc(dascStr[i])
    const st1 = dasc(dascStr[i + 1])
    deResult.push(parseInt(`${st0}${st1}`, 17))
  }
  return textDecoder.decode(new Uint8Array(deResult))
}

const setUserSessionStorage = (user: User) => {
  userS.value = user
  sessionStorage.setItem('user', encode(JSON.stringify(user)))
}

const u = sessionStorage.getItem('user')
const userS = ref<User>()
u && (userS.value = JSON.parse(decode(u)))

const store = { userS, setUserSessionStorage }
export const useUserStore = () => {
  return store
}
