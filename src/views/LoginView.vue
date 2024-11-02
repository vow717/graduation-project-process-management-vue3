<script setup lang="ts">
import {
  Apple,
  Check,
  ColdDrink,
  Female,
  Food,
  Fries,
  House,
  Male,
  Orange,
  Pear,
  Refresh,
  Sugar,
  SwitchButton,
  UserFilled,
  Watermelon
} from '@element-plus/icons-vue'

import { CommonService } from '@/services/index'
import { ref } from 'vue'

const userForm = ref({
  number: '',
  password: '',
  sex: '',
  department: ''
})
const departments = ref(['软件工程', '计算机科学与技术', '大数据', '人工智能'])

const resetUser = () => {
  userForm.value.number = ''
  userForm.value.department = ''
  userForm.value.password = ''
  userForm.value.sex = ''
}

const loginF = async () => {
  const user = {
    number: userForm.value.number,
    password: userForm.value.password
  }
  resetUser()
  await CommonService.loginGuardService(user)
}
</script>
<template>
  <div>
    <div class="d1">
      <div class="d2">
        <el-divider>
          <el-icon><Watermelon /></el-icon>
          <el-icon><Fries /></el-icon>
          <el-icon><Pear /></el-icon>
          <el-icon><Apple /></el-icon>
          <el-icon><Sugar /></el-icon>
          <el-icon><Food /></el-icon>
          <el-icon><ColdDrink /></el-icon>
          <el-icon><Orange /></el-icon>
          <el-icon><IceTea /></el-icon>
        </el-divider>
        <el-form>
          <el-form-item>
            <el-input
              v-model="userForm.number"
              :prefix-icon="UserFilled"
              size="large"
              placeholder="请输入您的账号"
              :rules="[{ required: true, message: '账号不能为空', trigger: 'blur' }]"
            />
          </el-form-item>

          <el-form-item>
            <el-input
              v-model="userForm.password"
              type="password"
              size="large"
              :prefix-icon="SwitchButton"
              placeholder="请输入您的密码"
              :rules="[{ required: true, message: '密码不能为空', trigger: 'blur' }]"
            />
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="userForm.sex">
              <el-radio value="1" size="large">
                <span
                  ><el-icon size="large"><Male /></el-icon
                ></span>
              </el-radio>

              <el-radio value="0" size="large">
                <span
                  ><el-icon size="large"><Female /></el-icon
                ></span>
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-select v-model="userForm.department">
              <template #prefix>
                <el-icon><House></House></el-icon>
              </template>
              <el-option
                v-for="(item, index) in departments"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <div style="position: relative; left: 300px">
              <el-button
                type="primary"
                :icon="Check"
                @click="loginF"
                :disabled="!userForm.number || !userForm.password"
                >登入</el-button
              >
              <el-button @click="resetUser()" :icon="Refresh">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<style>
.d1 {
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  background-color: #93b7dd;
}
.d2 {
  position: relative;
  height: 320px;
  width: 480px;
  border-radius: 15px;

  background-color: white;
  padding: 10px;
}
</style>
