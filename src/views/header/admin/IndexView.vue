<script setup lang="ts">
import { ref } from 'vue'

const menus = [
  {
    name: '功能',
    path: '/admin'
  }
]
const route = useRoute()
const activeIndexR = ref('')
watch(route, () => {
  const p = menus.find((mn) => route.path.includes(mn.path))
  activeIndexR.value = p?.path ?? ''
})
</script>
<template>
  <div>
    <el-menu :default-active="activeIndexR" mode="horizontal" router>
      <template v-for="(menu, index) in menus" :key="index">
        <el-menu-item :index="menu.path">{{ menu.name }}</el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
