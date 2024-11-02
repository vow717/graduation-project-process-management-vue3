import * as consty from '@/datasource/const'
import type { ResultVO } from '@/datasource/type'
import { createServer, Response } from 'miragejs'

const server = createServer({})
server.namespace = 'api'
//接收 POST 请求 /login-guard，根据提交的用户名和密码返回不同的登录结果，包括不同角色的 token 和用户信息。
server.post('login-guard', (_schema, request) => {
  const { number, password } = JSON.parse(request.requestBody)
  const resultVO: ResultVO<{}> = { code: 200, data: {} }
  if (number == 'student' && password == 'student') {
    return new Response(
      200,
      {
        role: consty.STUDENT,
        token:
          '744193c872b677aab12a0ced447882f4cf9fca92a09d428a26ed145ed2ed2eec665c8824ebc353042ba2be136efcb5c6'
      },
      resultVO
    )
  }
  if (number == 'teacher' && password == 'teacher') {
    return new Response(
      200,
      {
        role: consty.TEACHER,
        token:
          '744193c872b677aab12a0ced447882f4cf9fca92a09d428a26ed145ed2ed2eec665c8824ebc353042ba2be136efcb5c6'
      },
      resultVO
    )
  }
  if (number == 'admin' && password == 'admin') {
    return new Response(
      200,
      {
        role: consty.ADMIN,
        token:
          '744193c872b677aab12a0ced447882f4cf9fca92a09d428a26ed145ed2ed2eec665c8824ebc353042ba2be136efcb5c6'
      },
      resultVO
    )
  }
  resultVO.code = 401
  resultVO.message = '用户名密码错误'

  return resultVO
})
