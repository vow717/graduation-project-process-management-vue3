<script setup lang="ts">
import { Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'

const pwR = ref({ p1: '', p2: '' })
const SubmitF = async () => {}
</script>
<template>
  <div>
    <el-row>
      <el-col style="margin: 10px"> 目前您的密码不安全，建议修改您的密码 </el-col>
      <el-col style="margin: 10px">
        <el-input
          placeholder="请输入要改成的密码"
          style="width: 300px"
          :prefix-icon="Lock"
          v-model="pwR.p1"
        ></el-input>
      </el-col>
      <el-col style="margin: 10px">
        <el-input
          placeholder="请确认要改成的密码"
          style="width: 300px"
          :prefix-icon="Lock"
          v-model="pwR.p2"
        ></el-input>
      </el-col>
      <el-col style="margin: 10px">
        <el-button type="primary" @click="SubmitF">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>
