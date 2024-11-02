<script setup lang="ts">
import { ref } from 'vue'

const menus = [
  {
    name: '功能',
    path: '/admin'
  }
]
const activeIndexR = ref('1')
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
