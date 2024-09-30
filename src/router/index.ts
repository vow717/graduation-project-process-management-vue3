import { createElNotificationError, createElNotificationSuccess } from '@/components/message'
import * as Consty from '@/datasource/const'
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/nav',
    component: () => import('@/views/navView.vue')
  },
  {
    name: 'User',
    path: '/user',
    meta: { role: Consty.USER },
    component: () => import('@/views/user/IndexView.vue'),
    beforeEnter: () => {
      createElNotificationSuccess('用户您好')
    }
  },
  {
    name: 'Admin',
    path: '/admin',
    meta: { role: Consty.ADMIN },
    component: () => import('@/views/admin/IndexView.vue'),
    beforeEnter: () => {
      createElNotificationSuccess('管理员您好')
    }
  }
]

const router = createRouter({
  // HTML5 Mode。createWebHistory()函数，生产环境下需要web容器完成转发
  // createWebHashHistory()函数仍使用#符号，无需配置
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(),
  routes
})

//路由守卫建立：
router.beforeEach((to, from) => {
  if (!to.meta.role) {
    return true
  }
  if (to.meta.role != sessionStorage.getItem('role')) {
    createElNotificationError('暂无权限')
    // 直接返回路由地址
    // return '/login'
    // 支持返回路由对象
    return { name: 'Login' }
  }

  return true
})

export default router
