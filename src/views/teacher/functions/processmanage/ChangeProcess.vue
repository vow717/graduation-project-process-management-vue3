<script setup lang="ts">
import { createElNotificationSuccess } from '@/components/message'
import type { Process, ProcessItem, StudentAttach } from '@/datasource/type'
import { TeacherService } from '@/services/TeacherService'
import { CirclePlus, Minus } from '@element-plus/icons-vue'
import { ElButton, ElCol, ElDialog, ElInput, ElOption, ElRow, ElSelect } from 'element-plus'
import { computed, ref, render } from 'vue'
const prop = defineProps<{
  process: Process
  allPoint: number
}>()

const dialogVisible = ref(true)
// 这样深拷贝是为了避免直接修改prop的值,进而造成不可预知的错误
const processR = ref<Process>(JSON.parse(JSON.stringify(prop.process)))
const processItemR = ref<ProcessItem>({})
const processItemsR = ref<ProcessItem[]>(processR.value.items ?? [])
const processAttachR = ref<StudentAttach>({})
const processAttachsR = ref<StudentAttach[]>(processR.value.studentAttach ?? [])

const addItemF = () => {
  processItemR.value.number = processItemsR.value.length
  processItemsR.value.push(processItemR.value)
  processItemR.value = {}
  processR.value.items = processItemsR.value
}
const addAttachF = () => {
  processAttachR.value.number = processAttachsR.value.length
  processAttachsR.value.push(processAttachR.value)
  processAttachR.value = {}
  processR.value.studentAttach = processAttachsR.value
}
const delAttachF = (attach: StudentAttach) => {
  const index = processAttachsR.value.indexOf(attach)
  if (index > -1) {
    processAttachsR.value.splice(index, 1)
  }
}

const delItemF = (item: ProcessItem) => {
  const index = processItemsR.value.indexOf(item)
  if (index > -1) {
    processItemsR.value.splice(index, 1)
  }
}

const addProcessF = async () => {
  await TeacherService.addProcessService(processR.value)
  createElNotificationSuccess('过程修改成功')
  dialogVisible.value = false
  processR.value = {}
}

const delProcessF = async () => {
  // 弹出确认框
  const confirmResult = await ElMessageBox.confirm('此操作将永久删除该过程，是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })

  if (confirmResult === 'confirm') {
    // 用户确认删除，执行实际的删除操作
    await TeacherService.delProcessService(processR.value.id!)
    createElNotificationSuccess('过程删除成功')
    dialogVisible.value = false
    processR.value = {}
  } else {
    // 用户取消删除，可在此添加相应提示等操作，这里简单输出日志
    console.log('已取消删除操作')
  }
}
const pointOk = computed(() => {
  let pointAll = 0
  processItemsR.value.forEach((item) => {
    pointAll += item.point ?? 0
  })
  return pointAll == 100
})

const closeF = () => render(null, document.body)
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改过程"
    width="700"
    @close="closeF"
    :close-on-click-modal="false"
  >
    <template #default>
      <el-row :gutter="20" style="margin-bottom: 10px">
        <el-col :span="6">
          <el-input v-model="processR.name" placeholder="过程名称"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="processR.point" placeholder="占总比例" />
        </el-col>
        <el-col :span="6">
          <el-select v-model="processR.auth" placeholder="评分对象">
            <el-option label="评审" value="zg0NS"></el-option>
            <el-option label="导师" value="AsImV"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        v-for="(item, index) of processItemsR"
        :key="index"
        style="margin-bottom: 10px"
      >
        <el-col :span="6">
          {{ item.name }}
        </el-col>
        <el-col :span="6">
          {{ item.point }}
        </el-col>
        <el-col :span="6">
          <el-button
            type="danger"
            size="small"
            circle
            :icon="Minus"
            @click="delItemF(item)"
          ></el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px">
        <el-col :span="6">
          <el-input v-model="processItemR.name" placeholder="过程项名称" />
        </el-col>
        <el-col :span="6">
          <el-input v-model.number="processItemR.point" placeholder="占比例" type="number" />
        </el-col>
        <el-col :span="6">
          <el-button
            type="success"
            :icon="CirclePlus"
            size="small"
            circle
            @click="addItemF"
          ></el-button
        ></el-col>
      </el-row>

      <el-row
        :gutter="20"
        v-for="(attach, index) of processAttachsR"
        :key="index"
        style="margin-bottom: 10px"
      >
        <el-col :span="6">
          {{ attach.name }}
        </el-col>
        <el-col :span="6">
          {{ attach.ext }}
        </el-col>
        <el-col :span="6">
          <el-button
            type="danger"
            size="small"
            circle
            :icon="Minus"
            @click="delAttachF(attach)"
          ></el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="processAttachR.name" placeholder="学生附件名称" />
        </el-col>
        <el-col :span="6">
          <el-input v-model.number="processAttachR.ext" placeholder="学生附件扩展名(.pdf,.pptx)" />
        </el-col>
        <el-col :span="6">
          <el-button
            type="success"
            :icon="CirclePlus"
            size="small"
            circle
            @click="addAttachF"
          ></el-button
        ></el-col>
      </el-row>
    </template>
    <template #footer>
      <el-button type="primary" @click="dialogVisible = false">返回并取消</el-button>
      <el-button type="warning" @click="delProcessF">删除此过程</el-button>
      <p>prop.allpoin:{{ prop.allPoint }}</p>
      <el-button
        type="success"
        @click="addProcessF"
        :disabled="!pointOk || !processR.name || !processR.auth || processR.point! > prop.allPoint"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>
