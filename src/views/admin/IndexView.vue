<script setup lang="ts">
const components: { name: string; component: Component }[] = [
  {
    name: '专业管理',
    component: defineAsyncComponent(() => import('@/views/admin/DepartmentView.vue'))
  },
  {
    name: '教师管理',
    component: defineAsyncComponent(() => import('@/views/admin/TeacherView.vue'))
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
    <el-col class="my-col">
      <el-tag
        v-for="(com, index) of components"
        :type="typeC(com.name)"
        :key="index"
        @click="currentComponentR = com.name"
        style="cursor: pointer; margin-right: 10px"
      >
        {{ com.name }}
      </el-tag>
    </el-col>
  </el-row>
  <template v-if="currentComponentR">
    <component :is="currentComponentC" />
  </template>
</template>
