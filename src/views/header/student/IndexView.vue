<script setup lang="ts">
import type { Process } from '@/datasource/type'
import { CommonService } from '@/services'
import { ref } from 'vue'

const menus = [
  {
    name: '查看导师',
    path: '/student'
  }
]
const processesS = ref<Process[]>()
processesS.value = await CommonService.listProcessesService()
watchEffect(async () => {
  processesS.value = await CommonService.listProcessesService()
})

processesS.value?.forEach((pr) => {
  menus.push({ name: pr.name!, path: `/student/processes/${pr.id}` })
})

const activeIndexR = ref('1')
</script>
<template>
  <div>
    <!-- :default-active页面加载默认激活的菜单的index -->
    <el-menu :default-active="activeIndexR" mode="horizontal" router>
      <template v-for="(menu, index) in menus" :key="index">
        <el-menu-item :index="menu.path">{{ menu.name }}</el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
