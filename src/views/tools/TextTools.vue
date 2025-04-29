<!--
 * @author dengxingquan
 * @date 2023-04-25
 * @description 文本工具页面
 -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToolboxStore } from '@/stores/toolbox'
import type { ToolItem } from '@/stores/toolbox'

const router = useRouter()
const toolboxStore = useToolboxStore()

const textTools = ref<ToolItem[]>([])

// 模拟文本工具数据
const mockTextTools: ToolItem[] = [
  {
    id: 'text-formatter',
    name: '文本格式化',
    icon: 'Document',
    description: '格式化JSON、XML、HTML等文本内容',
    category: '文本工具',
    path: '/tools/text/formatter',
    favorite: false
  },
  {
    id: 'password-generator',
    name: '密码生成器',
    icon: 'Lock',
    description: '生成安全的随机密码',
    category: '文本工具',
    path: '/tools/text/password',
    favorite: false
  },
  {
    id: 'text-diff',
    name: '文本差异对比',
    icon: 'DocumentCopy',
    description: '对比两段文本的差异',
    category: '文本工具',
    path: '/tools/text/diff',
    favorite: false
  },
  {
    id: 'character-counter',
    name: '字符统计',
    icon: 'Histogram',
    description: '统计文本中的字符数、单词数等',
    category: '文本工具',
    path: '/tools/text/counter',
    favorite: false
  },
  {
    id: 'markdown-editor',
    name: 'Markdown编辑器',
    icon: 'Edit',
    description: '在线编辑和预览Markdown文档',
    category: '文本工具',
    path: '/tools/text/markdown',
    favorite: false
  },
  {
    id: 'code-formatter',
    name: '代码格式化',
    icon: 'Paperclip',
    description: '格式化美化各种编程语言代码',
    category: '文本工具',
    path: '/tools/text/code-formatter',
    favorite: false
  }
]

onMounted(() => {
  // 初始化工具数据
  textTools.value = mockTextTools
})

// 前往工具页面
const goToTool = (tool: ToolItem) => {
  toolboxStore.addToRecentlyUsed(tool.id)
  router.push(tool.path)
}

// 设置收藏
const toggleFavorite = (event: Event, tool: ToolItem) => {
  event.stopPropagation()
  toolboxStore.toggleFavorite(tool.id)
  tool.favorite = !tool.favorite
}
</script>

<template>
  <div class="text-tools-container">
    <h1 class="toolbox-title">文本工具</h1>
    
    <el-row :gutter="20">
      <el-col :span="8" v-for="tool in textTools" :key="tool.id">
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
.text-tools-container {
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