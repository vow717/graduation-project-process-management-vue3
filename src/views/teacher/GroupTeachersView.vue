<script setup lang="ts">
import type { User } from '@/datasource/type'
import { TeacherService } from '@/services/TeacherService'
import { ref } from 'vue'
const teachersS = ref<User[]>()
teachersS.value = await TeacherService.listGroupTeachersService()
</script>
<template>
  <div>
    <el-row>
      <el-col>
        第<el-tag>{{ teachersS![0].groupNumber }}</el-tag
        >组导师：
        <el-tag
          v-for="(teacher, index) of teachersS"
          :key="index"
          style="font-size: 20px; margin: 8px; padding: 15px"
          round
        >
          {{ teacher.name }}
        </el-tag>
      </el-col>
    </el-row>
  </div>
</template>
