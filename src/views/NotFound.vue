<!--
 * @author dengxingquan
 * @date 2023-04-25
 * @description 404页面
 -->
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在或已被删除</p>
      <div class="actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  text-align: center;
}

.content {
  max-width: 600px;
  padding: 40px;
}

h1 {
  font-size: 8rem;
  color: #409eff;
  margin: 0;
  line-height: 1;
}

h2 {
  font-size: 2rem;
  margin: 20px 0;
  color: #333;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style> 