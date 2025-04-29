<!--
 * @author dengxingquan
 * @date 2023-04-25
 * @description 加解密工具页面
 -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToolboxStore } from '@/stores/toolbox'
import type { ToolItem } from '@/stores/toolbox'
import { ElMessage } from 'element-plus'

const router = useRouter()
const toolboxStore = useToolboxStore()

const cryptoTools = ref<ToolItem[]>([])

// 模拟加解密工具数据
const mockCryptoTools: ToolItem[] = [
  {
    id: 'md5-encrypt',
    name: 'MD5加密',
    icon: 'Lock',
    description: '将文本转换为MD5哈希值',
    category: '加解密工具',
    path: '/tools/crypto/md5',
    favorite: false
  },
  {
    id: 'base64-convert',
    name: 'Base64转换',
    icon: 'Connection',
    description: '文本与Base64编码相互转换',
    category: '加解密工具',
    path: '/tools/crypto/base64',
    favorite: false
  },
  {
    id: 'aes-encrypt',
    name: 'AES加解密',
    icon: 'Key',
    description: '使用AES算法加密和解密文本',
    category: '加解密工具',
    path: '/tools/crypto/aes',
    favorite: false
  },
  {
    id: 'hash-calculator',
    name: '哈希计算器',
    icon: 'Finished',
    description: '计算SHA1/SHA256/SHA512等哈希值',
    category: '加解密工具',
    path: '/tools/crypto/hash',
    favorite: false
  },
  {
    id: 'jwt-decoder',
    name: 'JWT解析器',
    icon: 'Document',
    description: '解析和验证JWT令牌',
    category: '加解密工具',
    path: '/tools/crypto/jwt',
    favorite: false
  },
  {
    id: 'url-encoder',
    name: 'URL编解码',
    icon: 'Link',
    description: 'URL编码与解码转换',
    category: '加解密工具',
    path: '/tools/crypto/url',
    favorite: false
  }
]

onMounted(() => {
  // 初始化工具数据
  cryptoTools.value = mockCryptoTools
})

// 前往工具页面
const goToTool = (tool: ToolItem) => {
  toolboxStore.addToRecentlyUsed(tool.id)
  
  // 直接跳转到对应的路由
  if (tool.id === 'base64-convert') {
    router.push('/tools/crypto/base64')
  } else if (tool.id === 'md5-encrypt') {
    router.push('/tools/crypto/md5')
  } else {
    // 其他工具暂未实现，显示消息
    ElMessage({
      message: `${tool.name}功能正在开发中`,
      type: 'info'
    })
  }
}

// 设置收藏
const toggleFavorite = (event: Event, tool: ToolItem) => {
  event.stopPropagation()
  toolboxStore.toggleFavorite(tool.id)
  tool.favorite = !tool.favorite
}
</script>

<template>
  <div class="crypto-tools-container">
    <h1 class="toolbox-title">加解密工具</h1>
    
    <el-row :gutter="20">
      <el-col :span="8" v-for="tool in cryptoTools" :key="tool.id">
        <el-card class="tool-card toolbox-card" @click="goToTool(tool)">
          <div class="tool-header">
            <div class="tool-icon">
              <el-icon :size="24"><component :is="tool.icon" /></el-icon>
            </div>
            <div class="tool-name">{{ tool.name }}</div>
            <div class="tool-favorite" @click="(e) => toggleFavorite(e, tool)">
              <el-icon :size="20" :color="tool.favorite ? '#f56c6c' : '#909399'">
                <Star v-if="tool.favorite" />
                <StarFilled v-else />
              </el-icon>
            </div>
          </div>
          <div class="tool-desc">{{ tool.description }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.crypto-tools-container {
  width: 100%;
}

.tool-card {
  margin-bottom: 20px;
  height: 150px;
  transition: all 0.3s;
  position: relative;
}

.tool-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.tool-icon {
  margin-right: 10px;
  color: #409eff;
}

.tool-name {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  flex: 1;
}

.tool-favorite {
  cursor: pointer;
  z-index: 10;
}

.tool-desc {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style> 