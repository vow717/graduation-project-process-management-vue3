<script setup lang="ts">
import LoadingView from './components/LoadingView.vue'
</script>

<template>
  <suspense>
    <template #default>
      <router-view />
    </template>

    <template #fallback><loading-view /></template>
  </suspense>
</template>

<style></style>
