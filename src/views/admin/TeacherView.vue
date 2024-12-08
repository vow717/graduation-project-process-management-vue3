<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import type { Department, User } from '@/datasource/type'
import { AdminService } from '@/services/AdminService'
import { readTeacherFile } from '@/services/ExcelUtils'
import { ref } from 'vue'

const departmentsR = ref<Department[]>([])
const nowDepartmentR = ref<Department>()
departmentsR.value = await AdminService.listDepartmentsService()

const teachersR = ref<User[]>([])

const handleFile = (e: Event) => {
  const element = e.target as HTMLInputElement
  if (!element || !element.files) {
    return
  }
  readTeacherFile(element.files![0]).then((data) => {
    teachersR.value = data
  })
  element.value = ''
}
const submitF = async () => {
  if (!nowDepartmentR.value?.id) return
  await AdminService.addTeachersByExcelService(teachersR.value, nowDepartmentR.value.id)
  teachersR.value = []
  createElNotificationSuccess('导入成功')
}
</script>
<template>
  <el-row>
    <el-col :span="6">
      <el-select v-model="nowDepartmentR" size="large" placeholder="专业">
        <el-option
          v-for="department in departmentsR"
          :key="department.id"
          :value="department"
          :laber="department.name"
        >
          {{ department.name }}
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="3"> {{ nowDepartmentR?.name }}</el-col>
  </el-row>

  <br />
  <br />
  <input type="file" @change="handleFile" v-if="nowDepartmentR" />
  <el-button type="success" v-if="teachersR.length > 0" @click="submitF">导入</el-button>
  <el-row>
    <el-col>
      <el-tag
        v-for="(teacher, index) of teachersR"
        :key="index"
        style="font-size: 20px; margin: 8px; padding: 15px"
        round
      >
        {{ teacher.name }}
      </el-tag>
    </el-col>
  </el-row>
</template>
