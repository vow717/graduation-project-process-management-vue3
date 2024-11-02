<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore'
const userS = useUserStore().userS
</script>
<template>
  <div>
    <el-row>
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
