<script setup lang="ts">
import type { Process } from '@/datasource/type'
import { CommonService } from '@/services'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const processesS = ref<Process[]>()
processesS.value = await CommonService.listProcessesService()
watchEffect(async () => {
  processesS.value = await CommonService.listProcessesService()
})
processesS.value = await CommonService.listProcessesService()

const menus = ref<{ name: string; path: string }[]>([])
//把获取的导航栏数据插入menus中，并且path对应跳转的路由
watch(
  processesS,
  () => {
    menus.value.length = 0
    menus.value.push({
      name: '我的学生',
      path: '/teacher'
    })
    processesS.value!.forEach((ps) => {
      menus.value.push({ name: ps.name!, path: `/teacher/processes/${ps.id}/types/${ps.auth}` })
    })
  },
  { immediate: true }
)

const route = useRoute()
const activeIndexR = ref('')

watch(
  route,
  () => {
    const p = menus.value.find((mn) => mn.path == route.path)
    activeIndexR.value = p?.path ?? ''
  },
  { immediate: true }
)
</script>
<template>
  <div>
    <el-menu :default-active="activeIndexR" mode="horizontal" router>
      <template v-for="(menu, index) in menus" :key="index">
        <el-menu-item :index="menu.path">
          {{ menu.name }}
        </el-menu-item>
      </template>
      <el-menu-item index="/teacher/scores">小组成绩统计</el-menu-item>
      <el-menu-item index="/teacher/functions">功能</el-menu-item>
    </el-menu>
  </div>
</template>
