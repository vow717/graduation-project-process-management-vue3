<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import { TeacherService } from '@/services/TeacherService'
import { ref } from 'vue'

const studentNumber = ref<string>('')
const resetPassword = async () => {
  await TeacherService.resetPassword(studentNumber.value)
  createElNotificationSuccess('重置密码成功')
  studentNumber.value = ''
}
</script>
<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-input
          v-model="studentNumber"
          size="large"
          clearable
          placeholder="输入需要重置密码的用户账号"
        />
      </el-col>
      <el-col>
        <el-button type="primary" :disabled="studentNumber.length == 0" @click="resetPassword"
          >重置密码为账号</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>
