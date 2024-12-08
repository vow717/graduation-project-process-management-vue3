<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import type { User } from '@/datasource/type'
import { readStudentForSelectionFile } from '@/services/ExcelUtils'
import { TeacherService } from '@/services/TeacherService'

import { ref } from 'vue'
const studentsR = ref<User[]>([])
//e: Event是一个事件对象，包含了事件的所有信息，比如触发事件的元素，事件类型等
const handleFileChange = async (e: Event) => {
  const element = e.target as HTMLInputElement // 注释:e.target是一个EventTarget类型，需要转换为HTMLInputElement类型才能使用files属性
  if (!element || !element.files) {
    return
  }
  // 读取文件,并将文件内容赋值给studentR
  readStudentForSelectionFile(element.files![0]).then((data) => {
    studentsR.value = data
  })
  element.value = '' // 清空input的值，这样可以多次选择同一个文件
}

const submitF = async () => {
  await TeacherService.addStudentsService(studentsR.value)
  studentsR.value = []
  createElNotificationSuccess('学生导入成功')
}
</script>
<template>
  <el-row class="my-row">
    <el-col class="my-col" :span="6">
      读取学生表格：
      <input type="file" @change="handleFileChange" />
    </el-col>
    <el-col :span="2">
      <el-button type="success" v-if="studentsR.length > 0" @click="submitF">导入</el-button>
    </el-col>
    <el-col :span="12">
      {{ studentsR }}
    </el-col>
  </el-row>
</template>
