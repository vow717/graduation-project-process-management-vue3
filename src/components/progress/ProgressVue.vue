<script setup lang="ts">
import type { Progress } from '@/datasource/type'
import { computed } from 'vue'
const prop = defineProps<{ progress: Progress }>()
const percentageC = computed(() => Math.round(prop.progress.percentage))
const rateC = computed(() => {
  return toFixed2(prop.progress.rate)
})
const totalC = computed(() => toFixed2(prop.progress.total))
const loadedC = computed(() => toFixed2(prop.progress.loaded))

const toFixed2 = (n: number) => (n / 1024 / 1024).toFixed(2)
</script>
<template>
  <div>
    <el-progress :percentage="percentageC" />
    {{ rateC }} MB {{ loadedC }} MB / {{ totalC }} MB
    <br />
    {{ prop.progress.title }}
  </div>
</template>
<style>
.el-notification__group {
  flex: 1;
}
</style>
