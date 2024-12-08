<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import type { Department } from '@/datasource/type'
import { AdminService } from '@/services/AdminService'
import { Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'

const departmentsR = ref<Department[]>([])
departmentsR.value = await AdminService.listDepartmentsService()

const newDepartmentNameR = ref('')
const submitF = async () => {
  await AdminService.addDepartmentService({ name: newDepartmentNameR.value })
  departmentsR.value = await AdminService.listDepartmentsService()
  createElNotificationSuccess('添加专业成功')
  newDepartmentNameR.value = ''
}
const delDepartmentF = async (did: string) => {
  await AdminService.delDepartmentService(did)
  departmentsR.value = await AdminService.listDepartmentsService()
  createElNotificationSuccess('删除专业成功')
}
</script>
<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-input v-model="newDepartmentNameR" placeholder="请输入专业名称" wight="300px" />
      </el-col>
      <el-col :span="6"><el-button type="success" @click="submitF">添加</el-button></el-col>
    </el-row>
  </div>
  <div>
    <el-table :data="departmentsR">
      <el-table-column type="index" label="" width="50" />
      <el-table-column>
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
          <el-button @click="delDepartmentF(scope.row.id)" :icon="Delete" circle type="danger" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
