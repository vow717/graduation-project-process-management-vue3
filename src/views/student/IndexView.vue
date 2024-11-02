<script setup lang="ts"></script>
<template>
  <div>
    <!-- 将组件包裹在 KeepAlive 里面，表示当该组件被移除时，Vue 不会销毁它，而是会将其保存在内存中。(缓存动态组件)-->
    <RouterView v-slot="{ Component }" :key="$route.fullPath">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </div>
</template>
