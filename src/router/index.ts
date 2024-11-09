import { createElNotificationSuccess } from '@/components/message'
import * as Consty from '@/datasource/const'
import { CommonService } from '@/services'
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    roles?: string[]
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  },
  {
    path: '',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/',
    component: () => import('@/views/IndexView.vue'),
    meta: {
      roles: [Consty.ADMIN, Consty.STUDENT, Consty.TEACHER]
    },
    children: [
      {
        path: 'settings',
        component: () => import('@/views/header/SettingView.vue')
      },
      {
        name: 'Student',
        path: 'student',
        meta: { roles: [Consty.STUDENT] },
        component: () => import('@/views/student/IndexView.vue'),
        beforeEnter: () => {
          createElNotificationSuccess('同学您好')
        },
        children: [
          {
            path: '',
            component: () => import('@/views/student/TutorView.vue')
          },
          {
            path: 'processes/:pid',
            component: () => import('@/views/student/ProcessView.vue')
          }
        ]
      },
      {
        name: 'Teacher',
        path: 'teacher',
        meta: { roles: [Consty.TEACHER] },
        component: () => import('@/views/teacher/IndexView.vue'),
        beforeEnter: () => {
          createElNotificationSuccess('老师您好')
        },
        children: [
          {
            path: '',
            component: () => import('@/views/teacher/TutorStudentView.vue')
          },
          {
            path: 'scores',
            component: () => import('@/views/teacher/GroupScoringsView.vue')
          },
          {
            path: 'processes/:pid/types/:auth',
            component: () => import('@/views/teacher/ProcessView.vue')
          },
          {
            path: 'functions',
            component: () => import('@/views/teacher/functions/Index.vue')
          }
        ]
      },
      {
        name: 'Admin',
        path: 'admin',
        meta: { roles: [Consty.ADMIN] },
        component: () => import('@/views/admin/IndexView.vue'),
        beforeEnter: () => {
          createElNotificationSuccess('管理员您好')
        }
      }
    ]
  }
]

const router = createRouter({
  // HTML5 Mode。createWebHistory()函数，生产环境下需要web容器完成转发
  // createWebHashHistory()函数仍使用#符号，无需配置
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

//路由守卫建立：
router.beforeEach((to) => {
  if (!to.meta.roles) {
    return true
  }

  const role = to.meta.roles!.find((r) => r == CommonService.getRole())
  if (role) {
    return true
  }
  sessionStorage.clear()
  return '/login'
})

export default router
