<script setup lang="ts">
import { StudentService } from '@/services/StudentService'
import { useUserStore } from '@/stores/UserStore'
const userS = useUserStore().userS

const fileList = ref([])
const avatarUrl = ref('') // 用于存储头像的URL

const handleAvatarUpload = async (file: any) => {
  const formData = new FormData()
  formData.append('file', file.raw) // 只上传文件
  await StudentService.uploadAvatarService(formData) // 调用上传头像的服务
  await fetchAvatar() // 上传后获取头像
}

const fetchAvatar = async () => {
  try {
    const blob = await StudentService.getAvatarService() // 获取头像的Blob数据
    console.log(blob)
    avatarUrl.value = URL.createObjectURL(blob) // 创建头像的URL
    console.log(avatarUrl.value)
  } catch (error) {
    console.error('Error fetching avatar:', error)
  }
}

onMounted(() => {
  fetchAvatar() // 组件挂载时获取头像
})
</script>
<template>
  <div>
    <el-row>
      <el-col>
        <div style="margin: auto; padding-bottom: 10px" align="center">
          <el-upload
            class="upload-demo"
            action=""
            :on-change="handleAvatarUpload"
            :file-list="fileList"
            :auto-upload="false"
            accept="image/*"
          >
            <i class="el-icon-upload"></i>
            <el-text type="primary" size="large">点击上传头像</el-text>
          </el-upload>
          <div v-if="avatarUrl" style="margin-top: 20px">
            <img
              :src="avatarUrl"
              alt="用户头像"
              style="width: 100px; height: 100px; border-radius: 50%"
            />
          </div>
        </div>
      </el-col>
      <el-col>
        <div style="margin: auto; padding-bottom: 10px" align="center">
          <p>指导教师：{{ userS?.student?.teacherName }}</p>
          <p>毕设标题:{{ userS?.student?.projectTitle }}</p>
          <p>所在答辩组：{{ userS?.groupNumber }}</p>
          <p>答辩顺序:{{ userS?.student?.queueNumber }}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
