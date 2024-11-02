<script setup lang="ts">
import * as consty from '@/datasource/const'
import router from '@/router'
import { CommonService } from '@/services'
import { Setting, SwitchButton } from '@element-plus/icons-vue'
import { defineAsyncComponent, type Component } from 'vue'
const role = CommonService.getRole()

let realComponent: Component
if (role == consty.ADMIN) {
  realComponent = defineAsyncComponent(() => import('@/views/header/admin/IndexView.vue'))
} else if (role == consty.STUDENT) {
  realComponent = defineAsyncComponent(() => import('@/views/header/student/IndexView.vue'))
} else if (role == consty.TEACHER) {
  realComponent = defineAsyncComponent(() => import('@/views/header/teacher/IndexView.vue'))
}

const logoutF = () => {
  sessionStorage.clear()
  router.push('/login')
}
</script>
<template>
  <div>
    <el-row class="my-row" style="padding: 3px" align="middle">
      <el-col :span="4">
        <el-button
          type="danger"
          :icon="Setting"
          style="margin: 10px"
          @click="$router.push('/settings')"
        >
          设置
        </el-button>
      </el-col>

      <!-- 基于权限加载上功能栏 -->
      <el-col :span="18">
        <component :is="realComponent" />
      </el-col>
      <el-col :span="2">
        <el-icon id="logout" :size="32" color="red" @click="logoutF">
          <SwitchButton />
        </el-icon>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped>
#logout :hover {
  cursor: pointer;
}
</style>
