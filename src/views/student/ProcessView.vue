<script setup lang="ts">
import { createElNotificationError, createElNotificationSuccess } from '@/components/message'
import type { Process, ProcessFile, StudentAttach } from '@/datasource/type'
import { CommonService } from '@/services'
import { StudentService } from '@/services/StudentService'
import { useUserStore } from '@/stores/UserStore'
import { Check, SuccessFilled, WarnTriangleFilled } from '@element-plus/icons-vue'
const route = useRoute()
let params = route.params as { pid: string }

const processFilesR = ref<ProcessFile[]>([])
processFilesR.value = await StudentService.listProcessFilesService(params.pid)

//这个函数用来判断是否已经上传了文件
const showCheckedC = computed(
  () => (attach: StudentAttach) => processFilesR.value.find((pf) => pf.number == attach.number)
)
const processesS = ref<Process[]>([])
processesS.value = await CommonService.listProcessesService()
const studentPR = ref<Process>()
watch(
  route,
  () => {
    params = route.params as { pid: string }
    studentPR.value = processesS.value.find((sp) => sp.id == params.pid)
  },
  { immediate: true }
)

const selectAttachR = ref<StudentAttach>()
//fileInputR用来获取input标签,visableSubmitR用来控制提交按钮的显示与隐藏,fileR用来存储上传的文件,
const fileInputR = ref<HTMLInputElement>()
const visableSubmitR = ref(false)
const fileR = ref<File>()
const userS = useUserStore().userS
const activeF = (attach: StudentAttach) => {
  selectAttachR.value = attach
  //这个代码用来触发input标签的点击事件，从而实现文件上传
  //注解：nextTick是Vue提供的一个API，用来在DOM更新之后执行的回调函数
  //触发后，会调用input标签的click事件，从而实现文件上传
  nextTick(() => {
    fileInputR.value?.click()
  })
}
const changeF = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    fileR.value = target.files[0]
    visableSubmitR.value = true
  }
}

const uploadF = async () => {
  if (!fileR.value || !selectAttachR.value) {
    createElNotificationError('请先选择文件')
    return
  }
  const fName = fileR.value.name
  const ext = fName.substring(fName.lastIndexOf('.'))
  if (!selectAttachR.value?.ext?.includes(ext)) {
    createElNotificationError('文件类型不符合要求,请转为' + selectAttachR.value.ext)
    return
  }
  if (!userS.value) {
    return
  }
  //这里的fileName是上传文件的名字，格式为：组号-姓名-学号-附件名
  const fileName = `${userS.value.student?.queueNumber}-${userS.value.name}-${userS.value.number}-${selectAttachR.value?.name}${ext}`
  if (fileName.includes('/') || fileName.includes('\\')) {
    createElNotificationError('文件名不符合要求')
    return
  }
  const fdata = new FormData()
  //fdata是一个FormData对象，用来存储上传的文件,append方法用来添加键值对
  //这里的键值对是：pname:附件名，file:文件
  //fdata.append('pname',selectAttachR.value?.name ?? '')是为了在后端获取附件名
  //fdata.append('file',fileR.value,fileName)是为了在后端获取文件，其中fileName是上传文件的名字编码
  fdata.append('pname', selectAttachR.value?.name ?? '')
  fdata.append('file', fileR.value, fileName)
  console.log(fdata.get('pname'))
  //这里的sign是一个签名，用来保证上传文件的安全性
  const sign = await StudentService.uploadFileSignatureService(
    `${params.pid}${selectAttachR.value?.name}${fileName}${selectAttachR.value?.number!}`
  )
  processFilesR.value = await StudentService.uploadFileService(
    params.pid, //这里的pid是过程的id
    selectAttachR.value.number!, //这里的number是附件的序号
    sign, //这里的sign是一个签名，用来保证上传文件的安全性
    fdata //这里的fdata是一个FormData对象，用来存储上传的文件
  )
  createElNotificationSuccess('上传成功')
  visableSubmitR.value = false
  //这里的fileInputR.value?.value=''是为了清空input标签的值,前面的;是为了避免语法错误，因为如果不加分号，会被认为是一个代码块，而不是一个表达式
  ;(fileInputR.value as HTMLInputElement).value = ''
}
</script>
<template>
  <p>重新提交会自动覆盖</p>
  <div>
    <table>
      <tr
        v-for="(attach, index) of studentPR?.studentAttach"
        :key="index"
        style="margin-bottom: 10px"
      >
        <td>
          <el-icon :size="32" color="gray" v-if="showCheckedC(attach)">
            <SuccessFilled />
          </el-icon>
          <el-icon :size="28" color="red" v-if="!showCheckedC(attach)">
            <WarnTriangleFilled />
          </el-icon>
        </td>
        <td>
          <el-button @click="activeF(attach)" type="primary">{{ attach.name }}</el-button>
        </td>
        <td>
          {{ attach.description }}
        </td>
      </tr>
    </table>

    <input type="file" ref="fileInputR" hidden :accept="selectAttachR?.ext" @change="changeF" />
    <el-button type="success" @click="uploadF" :icon="Check" style="margin-right: 10px" />
    <span>{{ fileR?.name }}</span>
  </div>
</template>
