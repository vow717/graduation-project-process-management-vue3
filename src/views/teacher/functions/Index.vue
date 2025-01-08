<script setup lang="ts">
import { computed, defineAsyncComponent, ref, type Component } from 'vue'

const components: { name: string; component: Component }[] = [
  {
    name: '过程管理',
    component: defineAsyncComponent(() => import('./ProcessesView.vue'))
  },
  {
    name: '导入学生',
    component: defineAsyncComponent(() => import('./ImportStudentsView.vue'))
  },
  {
    name: '分配学生',
    component: defineAsyncComponent(() => import('./DistributeStudenstToTeachers.vue'))
  },
  {
    name: '分组学生',
    component: defineAsyncComponent(() => import('./GroupingStudentsView.vue'))
  },
  {
    name: '重置密码',
    component: defineAsyncComponent(() => import('./ResetPasswordView.vue'))
  },
  {
    name: '更新信息',
    component: defineAsyncComponent(() => import('./UpdateInfoView.vue'))
  },
  {
    name: '导出学生成绩(未完成)',
    component: defineAsyncComponent(() => import('./ExportStudentScoresView.vue'))
  }
]

const currentComponentR = ref()
const currentComponentC = computed(
  () => components.find((com) => com.name == currentComponentR.value)?.component
)
const typeC = computed(() => (name: string) => (name == currentComponentR.value ? 'danger' : ''))
</script>
<template>
  <el-row class="my-row">
    <el-col>
      <el-tag
        v-for="(com, index) of components"
        :type="typeC(com.name)"
        :key="index"
        @click="currentComponentR = com.name"
        style="cursor: pointer; margin-right: 10px"
      >
        {{ com.name }}
      </el-tag>

      <!-- <RouterLink replace to="/processfiles" style="cursor: pointer; margin-right: 10px">
        <el-tag type="warning">加载过程学生文件</el-tag>
      </RouterLink> -->
    </el-col>
  </el-row>
  <br />
  <template v-if="currentComponentR">
    <component :is="currentComponentC" />
  </template>
</template>
