<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const goToTop2 = () => {
  window.location.href = './views/loginView.vue'
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header><h2>Element-plus作业练习</h2></el-header>
      <el-container>
        <el-aside width="200px">
          <el-timeline>
            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">登入页面</router-link>
              <button @click="goToTop2">跳转到 Top2</button>
            </el-timeline-item>
            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">Nope</router-link>
            </el-timeline-item>
            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">Nope</router-link>
            </el-timeline-item>
            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">Nope</router-link>
            </el-timeline-item>
            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">Nope</router-link>
            </el-timeline-item>
            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">Nope</router-link>
            </el-timeline-item>
            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">Nope</router-link>
            </el-timeline-item>
            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">Nope</router-link>
            </el-timeline-item>
            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">Nope</router-link>
            </el-timeline-item>
            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">Nope</router-link>
            </el-timeline-item>
            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">Nope</router-link>
            </el-timeline-item>

            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">Nope</router-link>
            </el-timeline-item>
            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">Nope</router-link>
            </el-timeline-item>
            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">Nope</router-link>
            </el-timeline-item>
            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">Nope</router-link>
            </el-timeline-item>

            <el-timeline-item :timestamp="'2024-09-25'">
              <router-link to="/loginView">Nope</router-link>
            </el-timeline-item>
          </el-timeline>
        </el-aside>
        <el-main width="100%" height="980px"></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style></style>
