<script setup lang="ts">
import type { Process } from '@/datasource/type'
import { CommonService } from '@/services'
import { Edit } from '@element-plus/icons-vue'
import { ref, watchEffect } from 'vue'
import AddProcess from './processmanage/AddProcess.vue'
import { createChangeProcessDialog } from './processmanage/createChangeProcess'

const processesS = ref<Process[]>()
watchEffect(async () => {
  processesS.value = await CommonService.listProcessesService()
})
const changeProcessF = (process: Process) => {
  createChangeProcessDialog(process)
}
</script>
<template>
  <div style="margin: 10px">
    <el-col>
      <AddProcess />
    </el-col>
    <el-table :data="processesS" style="width: 95%">
      <el-table-column type="index" label="#" />
      <el-table-column property="name" label="过程名称" max-width="15%">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="打分对象" max-width="10%">
        <template #default="scope">
          {{ scope.row.auth == 'zg0NS' ? '评审' : '导师' }}
        </template>
      </el-table-column>
      <el-table-column label="总分值占比" max-width="10%">
        <template #default="scope"> {{ scope.row.point }}% </template>
      </el-table-column>
      <el-table-column label="详细分值" max-with="15%">
        <template #default="scope">
          <p v-for="(PItem, index) of scope.row.items" :key="index">
            {{ PItem.name }}-{{ PItem.point }}%
          </p>
        </template>
      </el-table-column>
      <el-table-column label="学生需交材料" max-width="10%">
        <template #default="scope">
          {{ scope.row.studentAttach ? scope.row.studentAttach[0].name : null }}-{{
            scope.row.studentAttach ? scope.row.studentAttach[0].ext : null
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" max-width="10%">
        <template #default="scope">
          <el-button type="primary" size="large" @click="changeProcessF(scope.row)">
            <el-icon :size="30">
              <Edit />
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
