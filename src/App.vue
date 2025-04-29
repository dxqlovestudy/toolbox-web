<!--
 * @author dengxingquan
 * @date 2023-04-25
 * @description 应用根组件
 -->
<script setup lang="ts">
// 应用程序入口组件
</script>

<template>
  <el-config-provider>
    <router-view />
  </el-config-provider>
</template>

<style scoped>
:deep(html, body) {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

:deep(#app) {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}
</style> 