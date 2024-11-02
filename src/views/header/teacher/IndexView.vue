<script setup lang="ts">
import type { Process } from '@/datasource/type'
import { CommonService } from '@/services'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const menus = [
  {
    name: '我的学生',
    path: '/teacher'
  }
]
const processesS = ref<Process[]>()
processesS.value = await CommonService.listProcessesService()

//把获取的导航栏数据插入menus中，并且path对应跳转的路由
processesS.value?.forEach((ps) => {
  menus.push({ name: ps.name!, path: `/teacher/processes/${ps.id}/types/${ps.auth}` })
})

const route = useRoute()
const activeIndexR = ref('')

watch(
  route,
  () => {
    const p = menus.find((mn) => mn.path == route.path)
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
      <!--
      <el-menu-item index="/teacher">功能</el-menu-item>
      -->
    </el-menu>
  </div>
</template>
