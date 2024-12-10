<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import type { User } from '@/datasource/type'
import { TeacherService } from '@/services/TeacherService'
import { ref } from 'vue'

const userNumber = ref<string>('')
const userInfo = ref<User>({})
const teachersR = ref<User[]>([])
teachersR.value = await TeacherService.listAllTeachersService()

const findUserF = async () => {
  userInfo.value = (await TeacherService.findUserByNumber(userNumber.value)) as User
  createElNotificationSuccess('查找成功')
}

const updateF = async () => {
  await TeacherService.updateStudentsService([userInfo.value])
  createElNotificationSuccess('更新成功')
  userNumber.value = ''
  userInfo.value = {}
}
</script>
<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-input v-model="userNumber" size="large" clearable />
        <el-button type="primary" :disabled="userNumber.length == 0" @click="findUserF"
          >查找</el-button
        >
      </el-col>
    </el-row>
    <br />
    <template v-if="userInfo.id">
      <p>姓名：{{ userInfo.name }}</p>
      <p>
        项目名称：
        <el-input
          v-model="userInfo.student.projectTitle"
          :placeholder="userInfo.student.projectTitle"
          style="width: 250px"
        />
      </p>
      <p>
        所在分组：
        <el-input type="number" v-model="userInfo.groupNumber" style="width: 150px" />
      </p>
      <p>
        导师选择：
        <el-select v-model="userInfo.student.teacherName" style="width: 150px">
          <el-option
            v-for="teacher in teachersR"
            :key="teacher.id"
            :value="teacher.name"
            :label="teacher.name"
            >{{ teacher.name }}</el-option
          >
        </el-select>
      </p>
      <br />
      <el-button type="primary" @click="updateF">更新信息</el-button>
    </template>
  </div>
</template>
